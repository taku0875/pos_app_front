import "./globals.css";

export const metadata = {
  title: "POSアプリ",
  description: "スマホで使える簡易POSシステム",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
