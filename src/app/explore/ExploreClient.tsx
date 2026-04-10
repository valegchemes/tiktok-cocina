"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import RecipeSheet from "@/components/recipe/RecipeSheet";

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  tags: string[];
  user: { username: string; avatarUrl: string | null };
  recipe: any | null;
  _count: { likes: number };
}

export default function ExploreClient({
  videos,
  topTags,
  initialQuery,
}: {
  videos: VideoItem[];
  topTags: string[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { openRecipeSheet } = useStore();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    });
  }

  function handleTag(tag: string) {
    startTransition(() => {
      router.push(`/explore?tag=${encodeURIComponent(tag)}`);
    });
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-zinc-900 px-4 pt-4 pb-3 space-y-3">
        <h1 className="text-xl font-bold">Explorar</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar recetas, platos, chefs..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); router.push("/explore"); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Tag pills */}
        {topTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {topTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTag(tag)}
                className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {isPending ? (
        <div className="flex-1 flex items-center justify-center text-zinc-600">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#ff0050] rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3">
          <Search size={48} />
          <p className="font-medium">{initialQuery ? `Sin resultados para "${initialQuery}"` : "Busca una receta"}</p>
        </div>
      ) : (
        <>
          {initialQuery && (
            <p className="px-4 py-3 text-sm text-zinc-500">
              {videos.length} resultado{videos.length !== 1 ? "s" : ""} para &ldquo;{initialQuery}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-2 gap-0.5 p-0.5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="aspect-[9/16] bg-zinc-900 relative overflow-hidden cursor-pointer group"
                onClick={() => video.recipe && openRecipeSheet(video.id, video.recipe)}
              >
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/90 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-2">{video.title}</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">@{video.user.username}</p>
                  {video.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {video.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-white/10 rounded-full px-1.5 py-0.5 text-zinc-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
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
