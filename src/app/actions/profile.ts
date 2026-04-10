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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;
  const bio = formData.get("bio") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "tiktok-cocina/avatars", transformation: [{ width: 400, height: 400, crop: "fill" }] },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result as { secure_url: string });
        }
      ).end(buffer);
    });
    avatarUrl = uploaded.secure_url;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username,
      fullName,
      bio,
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  });

  revalidatePath("/profile");
  return { success: true };
}
