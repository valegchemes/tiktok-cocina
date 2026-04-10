import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SavedClient from "./SavedClient";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const savedVideos = await prisma.saved.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      video: {
        include: {
          user: { select: { username: true, avatarUrl: true } },
          recipe: true,
          _count: { select: { likes: true } },
        },
      },
    },
  });

  const videos = savedVideos.map((s) => s.video);

  return <SavedClient videos={videos} />;
}
