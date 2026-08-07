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
  title: "Atlas Design System — 集团体验规范",
  description: "面向 HMI、Mobile App 与 Web / PC 的集团级设计系统与体验规范。",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "Atlas Design System",
    description: "面向 HMI、Mobile App 与 Web / PC 的集团级设计系统与体验规范。",
    images: [{ url: `${siteOrigin}/og.png`, width: 1200, height: 630, alt: "Atlas Design System 集团体验规范" }],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Design System",
    description: "集团体验规范",
    images: [`${siteOrigin}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
