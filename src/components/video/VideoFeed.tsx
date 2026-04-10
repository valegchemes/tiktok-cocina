"use client";

import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";

// Mock data until DB is fully connected
const mockVideos = [
  {
    id: "1",
    url: "https://videos.pexels.com/video-files/5320002/5320002-uhd_2160_4096_25fps.mp4",
    title: "Pasta Carbonara Fácil",
    description: "Aprende a hacer la auténtica pasta carbonara sin crema de leche. #Pasta #Carbonara #RecetasRapidas",
    author: {
      username: "chef_tano",
      avatarUrl: ""
    },
    likes: 12400,
    comments: 342,
    saves: 8520,
    recipeData: {
      id: "r1",
      ingredients: [
        { name: "Pasta (Espagueti)", quantity: "200g", checked: false },
        { name: "Panceta o Guanciale", quantity: "100g", checked: false },
        { name: "Yemas de huevo", quantity: "3", checked: false },
        { name: "Queso Pecorino Romano", quantity: "50g", checked: false },
        { name: "Pimienta negra", quantity: "al gusto", checked: false },
      ],
      steps: [
        { text: "Poner a hervir agua con sal y añadir la pasta." },
        { text: "Mientras tanto, cortar la panceta en tiras y dorar en una sartén sin aceite extra hasta que esté crujiente.", timerSeconds: 300 },
        { text: "En un bol, mezclar las yemas con el queso rallado y abundante pimienta negra." },
        { text: "Escurrir la pasta (guardando un poco de agua de cocción) y echar a la sartén con la panceta (fuera del fuego)." },
        { text: "Añadir la mezcla de yemas y un chorrito de agua de cocción. Remover enérgicamente hasta formar una salsa cremosa." }
      ]
    }
  },
  {
    id: "2",
    url: "https://videos.pexels.com/video-files/5803273/5803273-uhd_2160_3840_24fps.mp4",
    title: "Smoothie de Frutos Rojos",
    description: "Desayuno saludable en 5 minutos. Ideal para antes de entrenar 🏋️‍♀️ #Smoothie #Saludable #Fitness",
    author: {
      username: "fit_lifestyle",
      avatarUrl: ""
    },
    likes: 8320,
    comments: 120,
    saves: 3000,
    recipeData: {
      id: "r2",
      ingredients: [
        { name: "Frutos rojos congelados", quantity: "1 taza", checked: false },
        { name: "Plátano maduro", quantity: "1", checked: false },
        { name: "Leche de almendras", quantity: "200ml", checked: false },
        { name: "Proteína en polvo (opcional)", quantity: "1 scoop", checked: false },
      ],
      steps: [
        { text: "Añadir todos los ingredientes a la licuadora." },
        { text: "Licuar a máxima potencia hasta que quede una textura suave y sin grumos.", timerSeconds: 60 },
        { text: "Servir frío y decorar con algunas semillas de chía o fruta fresca arriba." }
      ]
    }
  }
];

interface Video {
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
  recipeData?: any;
}

export default function VideoFeed({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos.length > 0 ? initialVideos : mockVideos);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // If we have no initial videos from the server, we use the mocks
    if (initialVideos.length > 0) {
      setVideos(initialVideos);
    }
  }, [initialVideos]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6, // Trigger when 60% of the video is visible
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = videoRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setActiveVideoIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const currentRefs = videoRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-scroll snap-y-mandatory no-scrollbar"
    >
      {mockVideos.map((video, index) => (
        <div 
          key={video.id} 
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          className="h-full w-full snap-start"
        >
          <VideoPlayer 
            video={video} 
            isActive={index === activeVideoIndex} 
          />
        </div>
      ))}
    </div>
  );
}
