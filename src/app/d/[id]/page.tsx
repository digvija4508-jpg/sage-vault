import { getPublicDownloads, getPublicDownloadById } from "@/lib/downloads";
import { notFound } from "next/navigation";
import DirectDownloadClient from "./DirectDownloadClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const items = getPublicDownloads();
  return items.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getPublicDownloadById(id);

  if (!item) {
    return {
      title: "File Not Found - Sage Vault",
    };
  }

  return {
    title: `${item.title} - Sage Vault Protected Download`,
    description: item.description,
  };
}

export default async function DirectDownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getPublicDownloadById(id);

  if (!item) {
    notFound();
  }

  return <DirectDownloadClient item={item} />;
}
