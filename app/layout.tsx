import type { Metadata } from "next";
import "./globals.css";

const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages && repositoryName ? `/${repositoryName}` : "";
const siteOrigin =
  repositoryOwner && repositoryName
    ? `https://${repositoryOwner}.github.io/${repositoryName}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Design System — Experience Guidelines",
  description: "A multi-platform design system and experience guideline for HMI, mobile apps, and the web.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "Design System",
    description: "A multi-platform design system and experience guideline for HMI, mobile apps, and the web.",
    images: [{ url: `${siteOrigin}/og.png`, width: 1200, height: 630, alt: "Design System 设计体验规范" }],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design System",
    description: "Multi-platform experience guidelines",
    images: [`${siteOrigin}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
