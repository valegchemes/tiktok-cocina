"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Settings, Grid3x3, Heart, Camera, ChevronLeft, LogOut, Edit3, Check, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { updateProfile } from "@/app/actions/profile";

interface VideoMeta {
  id: string;
  title: string;
  videoUrl: string;
  views: number;
  _count: { likes: number; savedBy: number };
}

interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  videos: VideoMeta[];
  _count: { videos: number; likes: number };
}

export default function ProfileClient({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "likes">("videos");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    const fd = new FormData();
    fd.append("username", username);
    fd.append("fullName", fullName);
    fd.append("bio", bio);
    if (avatarFile) fd.append("avatar", avatarFile);
    await updateProfile(fd);
    setSaving(false);
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-zinc-900 transition">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="font-bold text-lg flex-1">@{profile.username}</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-zinc-900 transition">
            <Edit3 size={20} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-zinc-900 transition text-zinc-400">
              <X size={20} />
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#ff0050] rounded-xl text-sm font-bold disabled:opacity-60">
              {saving ? "..." : <Check size={16} />}
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ff0050] to-[#00f2fe] overflow-hidden cursor-pointer"
              onClick={() => isEditing && fileRef.current?.click()}
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt={username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                  {username[0].toUpperCase()}
                </div>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#ff0050] rounded-full p-1.5"
              >
                <Camera size={12} className="text-white" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Stats */}
          <div className="flex-1 flex gap-5 pt-2">
            {[
              { label: "Videos", value: profile._count.videos },
              { label: "Me gustas", value: profile._count.likes },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold">{stat.value.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Editable fields */}
        <div className="mt-4 space-y-2">
          {isEditing ? (
            <>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@usuario"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tu bio..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff0050] transition-colors text-sm resize-none"
              />
            </>
          ) : (
            <>
              {fullName && <p className="font-bold">{fullName}</p>}
              {bio && <p className="text-sm text-zinc-400 leading-relaxed">{bio}</p>}
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 px-5">
        {[
          { id: "videos" as const, icon: Grid3x3, label: "Videos" },
          { id: "likes" as const, icon: Heart, label: "Me gusta" },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex justify-center py-3 relative ${
                activeTab === tab.id ? "text-white" : "text-zinc-600"
              }`}
            >
              <Icon size={22} />
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-0.5 flex-1">
        {profile.videos.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-zinc-600">
            <Grid3x3 size={40} className="mb-3" />
            <p className="font-medium">Sin videos aún</p>
            <Link href="/upload" className="mt-3 text-[#ff0050] text-sm font-semibold">
              Subir primer video
            </Link>
          </div>
        ) : (
          profile.videos.map((video) => (
            <div key={video.id} className="aspect-[9/16] bg-zinc-900 relative overflow-hidden">
              <video
                src={video.videoUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="flex items-center gap-1 text-xs text-white">
                  <Heart size={10} className="fill-white" />
                  <span>{video._count.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sign Out */}
      <div className="px-5 py-4 border-t border-zinc-900">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-red-500 py-3 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
