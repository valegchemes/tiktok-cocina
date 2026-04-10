import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      videos: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { likes: true, savedBy: true } } },
      },
      _count: { select: { videos: true, likes: true } },
    },
  });

  if (!profile) redirect("/auth/login");

  return <ProfileClient profile={profile} />;
}
