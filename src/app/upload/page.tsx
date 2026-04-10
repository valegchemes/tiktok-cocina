"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Trash2, Clock, ChevronLeft, CheckCircle2, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadVideo } from "@/app/actions/video";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Step {
  text: string;
  timerSeconds?: number;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ text: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  }

  function removeIngredient(idx: number) {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  }

  function updateIngredient(idx: number, field: keyof Ingredient, value: string) {
    const updated = [...ingredients];
    updated[idx] = { ...updated[idx], [field]: value };
    setIngredients(updated);
  }

  function addStep() {
    setSteps([...steps, { text: "" }]);
  }

  function removeStep(idx: number) {
    setSteps(steps.filter((_, i) => i !== idx));
  }

  function updateStep(idx: number, field: keyof Step, value: string | number) {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: value };
    setSteps(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoFile) return setError("Selecciona un video");
    if (!title.trim()) return setError("Añade un título");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tagsInput);
    formData.append("ingredients", JSON.stringify(ingredients.filter((i) => i.name)));
    formData.append("steps", JSON.stringify(steps.filter((s) => s.text)));

    const result = await uploadVideo(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    }
  }

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 bg-black text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-500 rounded-full p-5"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold">¡Video publicado!</h2>
        <p className="text-zinc-400">Redirigiendo al feed...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-zinc-900 transition">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-bold flex-1">Subir Receta</h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#ff0050] text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Publicar"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-6 space-y-8 pb-24">
        {/* Video Upload Zone */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Video</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors ${
              videoPreview ? "border-zinc-700" : "border-zinc-700 hover:border-[#ff0050]"
            }`}
            style={{ aspectRatio: "9/16", maxHeight: 400 }}
          >
            {videoPreview ? (
              <video
                src={videoPreview}
                className="w-full h-full object-cover"
                controls={false}
                muted
                autoPlay
                loop
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <div className="bg-zinc-900 rounded-2xl p-4">
                  <Video size={36} />
                </div>
                <p className="font-medium">Toca para seleccionar video</p>
                <p className="text-sm text-zinc-600">MP4, WebM · Máx. 200MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="video"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleVideoSelect}
          />
          {videoFile && (
            <p className="text-xs text-zinc-500 mt-2 text-center truncate">{videoFile.name}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Título *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Pasta Carbonara Auténtica"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuéntanos sobre tu receta..."
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Tags</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="#Vegano, #Rápido, #Pasta"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Ingredientes</label>
          <div className="space-y-2">
            <AnimatePresence>
              {ingredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-2"
                >
                  <input
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                    placeholder="Ingrediente"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
                  />
                  <input
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                    placeholder="Cantidad"
                    className="w-24 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-3 flex items-center gap-2 text-sm text-[#ff0050] font-semibold"
          >
            <Plus size={16} /> Añadir ingrediente
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Pasos de preparación</label>
          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ff0050]/20 border border-[#ff0050]/40 flex items-center justify-center text-sm font-bold text-[#ff0050] shrink-0 mt-3">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={step.text}
                      onChange={(e) => updateStep(idx, "text", e.target.value)}
                      placeholder={`Paso ${idx + 1}...`}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors resize-none text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-500" />
                      <input
                        type="number"
                        value={step.timerSeconds ?? ""}
                        onChange={(e) => updateStep(idx, "timerSeconds", parseInt(e.target.value) || 0)}
                        placeholder="Temporizador (segundos)"
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
                      />
                    </div>
                  </div>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors self-start mt-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-3 flex items-center gap-2 text-sm text-[#ff0050] font-semibold"
          >
            <Plus size={16} /> Añadir paso
          </button>
        </div>

        {error && (
          <div className="bg-[#ff0050]/10 border border-[#ff0050]/30 text-[#ff0050] rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Submit floating button duplicate at bottom for UX */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff0050] hover:bg-[#e00045] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
        >
          {loading ? "Subiendo video..." : "🚀 Publicar receta"}
        </button>
      </form>
    </div>
  );
}
