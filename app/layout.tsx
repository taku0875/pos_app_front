import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "POSアプリ",
  description: "スマホで使える簡易POSシステム",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ja">
      <body className="bg-sky-100">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}