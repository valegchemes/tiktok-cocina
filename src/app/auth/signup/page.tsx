"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat, Eye, EyeOff, User, AtSign } from "lucide-react";
import { motion } from "framer-motion";
import { signUp } from "../actions";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      {/* Header Logo */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#ff0050] rounded-2xl p-4 mb-4"
        >
          <ChefHat size={36} className="text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black tracking-tight"
        >
          Únete a la comunidad
        </motion.h1>
      </div>

      {/* Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 flex-1"
      >
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Nombre de usuario
            </label>
            <div className="relative">
              <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="chef_tano"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-[#ff0050]/10 border border-[#ff0050]/30 text-[#ff0050] rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff0050] hover:bg-[#e00045] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 active:scale-[0.98]"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-zinc-600 px-4">
          Al registrarte aceptas nuestros Términos de Servicio y Política de Privacidad.
        </div>

        <div className="mt-4 text-center">
          <span className="text-zinc-500">¿Ya tienes cuenta? </span>
          <Link href="/auth/login" className="text-[#ff0050] font-semibold">
            Iniciar sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
