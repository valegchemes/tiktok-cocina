import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string };
}) {
  const { q, tag } = await searchParams;

  const videos = await prisma.video.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        tag ? { tags: { has: tag } } : {},
      ],
    },
    orderBy: { views: "desc" },
    take: 50,
    include: {
      user: { select: { username: true, avatarUrl: true } },
      recipe: true,
      _count: { select: { likes: true } },
    },
  });

  const popularTags = await prisma.video.findMany({
    select: { tags: true },
    take: 100,
  });

  // Flatten and count tags
  const tagCount: Record<string, number> = {};
  popularTags.forEach((v) => {
    v.tags.forEach((t) => {
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([name]) => name);

  return <ExploreClient videos={videos as any} topTags={topTags} initialQuery={q ?? ""} />;
}
