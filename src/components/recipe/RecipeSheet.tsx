"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { X, CheckCircle2, Circle, Clock, Play, Square } from "lucide-react";

function Timer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Here we could trigger a local notification or sound
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(seconds); // reset
    setIsActive(!isActive);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <button 
      onClick={toggleTimer}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-colors mt-2 ${
        isActive 
          ? "bg-[#ff0050] text-white" 
          : timeLeft === 0 
            ? "bg-green-500 text-white" 
            : "bg-zinc-800 text-zinc-300"
      }`}
    >
      {isActive ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
      {timeLeft === 0 ? "¡Tiempo!" : formatTime(timeLeft)}
    </button>
  );
}

export default function RecipeSheet() {
  const { isRecipeSheetOpen, closeRecipeSheet, activeRecipeData } = useStore();
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!activeRecipeData) return null;

  return (
    <AnimatePresence>
      {isRecipeSheetOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRecipeSheet}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                closeRecipeSheet();
              }
            }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#121212] z-[70] rounded-t-3xl shadow-xl flex flex-col border-t border-zinc-800 max-w-md mx-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-2 pb-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold">Receta Completa</h2>
              <button 
                onClick={closeRecipeSheet}
                className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-safe">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#ff0050] mb-4 flex items-center gap-2">
                  Ingredientes
                </h3>
                <ul className="space-y-3">
                  {activeRecipeData.ingredients.map((ing, idx) => {
                    const isChecked = checkedIngredients[idx];
                    return (
                      <li 
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-colors ${
                          isChecked ? "bg-zinc-800/50 opacity-60" : "bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckCircle2 className="text-[#ff0050]" size={20} />
                          ) : (
                            <Circle className="text-zinc-500" size={20} />
                          )}
                          <span className={`${isChecked ? "line-through" : ""} font-medium`}>
                            {ing.name}
                          </span>
                        </div>
                        <span className="text-sm text-zinc-400 font-semibold">{ing.quantity}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#00f2fe] mb-4 flex items-center gap-2">
                  Preparación
                </h3>
                <div className="space-y-6">
                  {activeRecipeData.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm shrink-0 text-[#00f2fe]">
                          {idx + 1}
                        </div>
                        {idx !== activeRecipeData.steps.length - 1 && (
                          <div className="w-0.5 h-full bg-zinc-800 mt-2" />
                        )}
                      </div>
                      <div className="pt-1 pb-4 flex-1">
                        <p className="text-zinc-200 leading-relaxed text-[15px]">
                          {step.text}
                        </p>
                        {step.timerSeconds && (
                          <Timer seconds={step.timerSeconds} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
