"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import RecipeSheet from "@/components/recipe/RecipeSheet";

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  user: { username: string; avatarUrl: string | null };
  recipe: { id: string; ingredients: unknown; steps: unknown } | null;
  _count: { likes: number };
}

export default function SavedClient({ videos }: { videos: VideoItem[] }) {
  const { openRecipeSheet } = useStore();

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-5 py-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bookmark size={22} className="fill-white" />
          Guardados
        </h1>
      </div>

      {videos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-600">
          <Bookmark size={48} />
          <p className="font-medium text-lg">Sin recetas guardadas</p>
          <Link href="/" className="text-[#ff0050] font-semibold text-sm">
            Explorar el feed
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-0.5 p-0.5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="aspect-[9/16] bg-zinc-900 relative overflow-hidden cursor-pointer"
                onClick={() => {
                  if (video.recipe) {
                    openRecipeSheet(video.id, video.recipe as any);
                  }
                }}
              >
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-2">{video.title}</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">@{video.user.username}</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                  <Bookmark size={14} className="fill-[#ff0050] text-[#ff0050]" />
                </div>
              </div>
            ))}
          </div>
          <RecipeSheet />
        </>
      )}
    </div>
  );
}
