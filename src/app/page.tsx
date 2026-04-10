import VideoFeed from "@/components/video/VideoFeed";
import RecipeSheet from "@/components/recipe/RecipeSheet";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, avatarUrl: true } },
      recipe: true,
      _count: { select: { likes: true } },
    },
    take: 10,
  });

  // Map Prisma data to what VideoFeed expects (until we unify types)
      const initialVideos = videos.map((v: any) => ({
    id: v.id,
    url: v.videoUrl,
    title: v.title,
    description: v.description || "",
    author: {
      username: v.user.username,
      avatarUrl: v.user.avatarUrl || "",
    },
    likes: v._count.likes,
    comments: 0, // We could add a comment count to Prisma later
    saves: 0,
    recipeData: v.recipe,
  }));

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-center py-10 pointer-events-none">
        <div className="flex gap-4 text-[17px] font-bold text-shadow pointer-events-auto">
          <button className="text-zinc-300 transition-colors">Siguiendo</button>
          <div className="w-[1.5px] h-4 bg-zinc-500 my-auto rounded-full" />
          <button className="text-white relative">
            Para Ti
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Feed */}
      <div className="flex-1 overflow-hidden relative">
        <VideoFeed initialVideos={initialVideos} />
      </div>

      {/* Overlay Bottom Sheet */}
      <RecipeSheet />
    </>
  );
}
