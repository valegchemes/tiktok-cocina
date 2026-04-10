# 🍳 TikTok Cocina: La PWA de Recetas Short-Video

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://tiktok-cocina.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

> Una plataforma inmersiva de descubrimiento culinario que combina la fluidez de interacción de TikTok con la utilidad práctica de un libro de cocina moderno.

---

## ✨ Características Principales

### 📱 Experiencia "Short-Video" Premium
*   **Snap Scrolling:** Navegación vertical fluida optimizada para dispositivos móviles.
*   **Auto-Play inteligente:** Reproducción automática basada en la visibilidad del componente (`IntersectionObserver`).
*   **UI Minimalista:** Diseño "OLED Black" enfocado 100% en el contenido visual.

### 🍱 Herramientas de Cocina Integradas
*   **Recipe Overlay:** Acceso instantáneo a ingredientes y pasos sin salir del video.
*   **Checklist Interactivo:** Marca los ingredientes que ya tienes listos.
*   **Timers en Vivo:** Temporizadores configurables directamente en el flujo de la preparación.

### 🔐 Ecosistema Completo
*   **Autenticación:** Sistema seguro con **Supabase Auth**.
*   **Perfiles Personalizables:** Gestión de usuario con carga de avatar vía **Cloudinary**.
*   **Upload de Video:** Subida de archivos UHD optimizada para streaming vía CDN.
*   **Búsqueda & Favoritos:** Filtra recetas por tags o palabras clave y guarda tus platos preferidos.

---

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
| :--- | :--- |
| **Next.js 16** | Framework Full-Stack (App Router & Proxy) |
| **Prisma 7** | ORM con soporte para Driver Adapters |
| **Supabase** | Backend-as-a-Service (PostgreSQL & Auth) |
| **Cloudinary** | Almacenamiento y optimización de Video/Imágenes |
| **Tailwind CSS** | Sistema de diseño y utilidades CSS |
| **Framer Motion** | Animaciones físicas y gestos táctiles |
| **Lucide React** | Set de iconos vectoriales premium |

---

## 🚀 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tiktok-cocina.git
    cd tiktok-cocina
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en el `.env.example`:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=tu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
    DATABASE_URL=tu_url_postgres

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    ```

4.  **Sincronizar base de datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Iniciar entorno de desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📦 Despliegue en Vercel

Este proyecto está optimizado para **Vercel**. Al desplegar, asegúrate de:
1.  Habilitar la opción de **Server Actions** en la configuración del proyecto (si no se detecta automáticamente).
2.  Aumentar el límite de tiempo de ejecución (Timeout) si planeas procesar videos muy largos.
3.  Configurar todas las variables de entorno listadas arriba en el Dashboard de Vercel.

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con ❤️ para amantes de la cocina y el código.
