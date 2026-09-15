import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "杨弋南 · AI Infra / Agent Harness",
  description: "杨弋南的个人技术站，记录 Agent Harness、大模型训练平台与生成式推荐实践。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
