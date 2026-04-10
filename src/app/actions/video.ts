"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadVideo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const videoFile = formData.get("video") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const ingredientsRaw = formData.get("ingredients") as string;
  const stepsRaw = formData.get("steps") as string;

  if (!videoFile || videoFile.size === 0) return { error: "No se proporcionó video" };
  if (videoFile.size > 200 * 1024 * 1024) return { error: "El video excede el límite de 200MB" };

  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
  if (!allowedTypes.includes(videoFile.type)) return { error: "Formato de video no soportado" };

  try {
    // Convert File to buffer for Cloudinary upload
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary as a stream
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "tiktok-cocina",
            eager: [{ width: 720, quality: "auto", fetch_format: "auto" }],
            eager_async: true,
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string; public_id: string });
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Parse ingredients & steps
    const ingredients = JSON.parse(ingredientsRaw || "[]");
    const steps = JSON.parse(stepsRaw || "[]");
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean)
      : [];

    // Save to DB
    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl: uploadResult.secure_url,
        tags,
        userId: user.id,
        recipe: {
          create: {
            ingredients,
            steps,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, videoId: video.id };
  } catch (err) {
    console.error(err);
    return { error: "Error al subir el video. Intenta de nuevo." };
  }
}

export async function toggleLike(videoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const existing = await prisma.like.findUnique({
    where: { userId_videoId: { userId: user.id, videoId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  } else {
    await prisma.like.create({ data: { userId: user.id, videoId } });
    return { liked: true };
  }
}

export async function toggleSave(videoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const existing = await prisma.saved.findUnique({
    where: { userId_videoId: { userId: user.id, videoId } },
  });

  if (existing) {
    await prisma.saved.delete({ where: { id: existing.id } });
    return { saved: false };
  } else {
    await prisma.saved.create({ data: { userId: user.id, videoId } });
    return { saved: true };
  }
}
