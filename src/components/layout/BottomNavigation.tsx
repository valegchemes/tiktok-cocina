"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, Bookmark, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/explore", icon: Compass, label: "Explorar" },
    { href: "/upload", icon: PlusSquare, label: "Subir", main: true },
    { href: "/saved", icon: Bookmark, label: "Guardados" },
    { href: "/profile", icon: User, label: "Perfil" },
  ];

  // Hide navigation on upload page or recipe detail if needed
  if (pathname === "/upload") return null;

  return (
    <nav className="bg-black/90 backdrop-blur-md border-t border-zinc-800 text-zinc-400 py-3 px-6 pb-safe">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.main) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center bg-white text-black h-10 w-12 rounded-xl active:scale-95 transition-transform"
                >
                  <Icon size={22} strokeWidth={2.5} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? "text-white" : "hover:text-zinc-200"
                } transition-colors`}
              >
                <Icon size={24} className={isActive ? "fill-white" : ""} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
