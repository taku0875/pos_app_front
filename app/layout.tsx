import "./globals.css";

export const metadata = {
  title: "POSアプリ",
  description: "スマホで使える簡易POSシステム",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ja">
      {/* ClientLayoutを削除し、body直下にchildrenを配置 */}
      <body>{children}</body>
    </html>
  );
}