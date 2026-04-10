"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, Save, ChefHat, Music } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  video: {
    id: string;
    url: string;
    title: string;
    description: string;
    author: {
      username: string;
      avatarUrl: string;
    };
    likes: number;
    comments: number;
    saves: number;
    recipeData?: any; // We will strictly type this later
  };
  isActive: boolean;
}

export default function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { openRecipeSheet } = useStore();

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-start flex items-center justify-center overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
        muted={false} // Would ideally default to muted or have a global un-mute state
      />

      {/* Play/Pause Overlay indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/50 rounded-full p-4 p-5 backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay - Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 text-shadow">
        {/* Profile */}
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800">
            {video.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
              <img src={video.author.avatarUrl} alt={video.author.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-tr from-[#ff0050] to-[#00f2fe]">
                {video.author.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <button className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#ff0050] rounded-full p-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        {/* Like */}
        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
          <motion.div animate={isLiked ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={32} className={isLiked ? "fill-[#ff0050] text-[#ff0050]" : "text-white"} />
          </motion.div>
          <span className="text-sm font-semibold">{video.likes + (isLiked ? 1 : 0)}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
          <MessageCircle size={32} className="text-white fill-white/20" />
          <span className="text-sm font-semibold">{video.comments}</span>
        </button>

        {/* Save */}
        <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
          <motion.div animate={isSaved ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
            <Save size={32} className={isSaved ? "fill-[#eab308] text-[#eab308]" : "text-white fill-white/20"} />
          </motion.div>
          <span className="text-sm font-semibold">{video.saves + (isSaved ? 1 : 0)}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
          <Share2 size={32} className="text-white fill-white/20" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>

      {/* UI Overlay - Bottom Left Information */}
      <div className="absolute left-4 bottom-20 right-20 flex flex-col items-start z-10 text-shadow">
        <h3 className="font-bold text-[17px] mb-2">@{video.author.username}</h3>
        <p className="text-[15px] mb-3 line-clamp-2">{video.description}</p>
        
        {/* Receta Link / CTA */}
        {video.recipeData && (
          <button 
            onClick={() => openRecipeSheet(video.id, video.recipeData)}
            className="flex items-center gap-2 bg-[#ff0050]/90 backdrop-blur-md px-4 py-2.5 rounded-xl font-bold text-[15px] active:scale-95 transition-transform"
          >
            <ChefHat size={20} />
            Ver Receta Completa
          </button>
        )}
        
        {/* Audio Ticker */}
        <div className="flex items-center gap-2 mt-4 text-sm font-medium w-full">
          <Music size={16} />
          <div className="w-[180px] overflow-hidden whitespace-nowrap mask-linear-fade">
             <div className="inline-block animate-marquee">
               sonido original - @{video.author.username}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
