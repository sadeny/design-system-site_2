import type { Metadata } from "next";
import "./globals.css";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true" && repositoryName;
const sitePath = isGitHubPages ? `/${repositoryName}` : "";
const siteOrigin = isGitHubPages
  ? `https://sadeny.github.io${sitePath}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Design System — 设计体验规范和指导",
  description: "面向 HMI、Mobile App 与 Web / PC 的集团级设计系统与体验规范。",
  icons: {
    icon: `${sitePath}/favicon.svg`,
    shortcut: `${sitePath}/favicon.svg`,
  },
  openGraph: {
    title: "Design System",
    description: "面向 HMI、Mobile App 与 Web / PC 的多终端设计系统与体验规范。",
    images: [{ url: `${siteOrigin}/og.png`, width: 1200, height: 630, alt: "Design System 设计体验规范" }],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design System",
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
