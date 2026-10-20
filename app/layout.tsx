import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "杨弋南 Yveson · AI Infra / Agent Harness",
  description: "杨弋南 Yveson 的个人技术空间。记录 9N-Harness 与智能开发、算法中台答疑 Bot 与评测、模型训推和算法工作流平台实践。",
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
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("yy-theme");document.documentElement.dataset.theme=t==="planet"?"planet":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
