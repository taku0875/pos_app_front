import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POSアプリ",
  description: "スマホで使える簡易POSシステム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>POSアプリ</title> {/* ← これを強制的に上書き */}
      </head>
      <body>{children}</body>
    </html>
  );
}
