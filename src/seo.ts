import type { ManifestOptions } from "vite-plugin-pwa";
import { APP_DESCRIPTION, APP_NAME } from "./utils/constants/app";

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: "https://example.com",
  description: APP_DESCRIPTION,
  type: "website",
  image: {
    url: "https://picsum.photos/1200/630",
    alt: "OpenGraph thumbnail description.",
    width: 1200,
    height: 630,
  },
  siteName: APP_NAME,
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: APP_NAME,
  short_name: APP_NAME,
  description: APP_DESCRIPTION,
  theme_color: "#30E130",
  background_color: "#ffffff",
  display: "minimal-ui",
  icons: [
    {
      src: "/favicons/favicon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/favicons/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "/favicons/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};
