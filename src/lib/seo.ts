import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type SeoOptions = {
  title?: string;
  description?: string;
  url?: string;
  keywords?: string[];
  images?: string[];
};

export function buildMetadata({
  title,
  description,
  url,
  keywords,
  images,
}: SeoOptions = {}): Metadata {
  const pageTitle = title
    ? `${title} · ${siteConfig.shortName}`
    : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const canonicalUrl = url ?? siteConfig.url;
  const ogImages = images ?? [siteConfig.ogImage];

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(canonicalUrl),
    keywords: keywords ?? siteConfig.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "website",
      locale: siteConfig.locale,
      images: ogImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: pageTitle,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ogImages,
    },
  };
}

