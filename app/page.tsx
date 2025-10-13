"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartList from "../components/CartList";
import ProductInfo from "../components/ProductInfo";

// カート内の商品の型定義
interface CartItem {
  product_id: number;
  product_code: string;
  name: string;
  price: number;
  tax_code: string;
  qty: number;
}

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<{ name: string; price: number } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // スキャナーページから戻ったときに商品情報を取得・追加する
  useEffect(() => {
    const scannedCode = localStorage.getItem("scannedCode");
    if (scannedCode) {
      localStorage.removeItem("scannedCode");
      fetchAndAddToCart(scannedCode);
    }
  }, []);

  const fetchAndAddToCart = async (code: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`);
      if (!res.ok) throw new Error("Product not found");

      const productData = await res.json();
      setBarcode(code);
      setProduct({ name: productData.name, price: productData.price });

      // カートに追加
      const newItem: CartItem = {
        product_id: productData.prd_id,
        product_code: productData.code,
        name: productData.name,
        price: productData.price,
        tax_code: "10", // 税コードを仮定
        qty: 1,
      };

      setCart((prevCart) => {
        const existingItem = prevCart.find(item => item.product_id === newItem.product_id);
        if (existingItem) {
          return prevCart.map(item =>
            item.product_id === newItem.product_id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prevCart, newItem];
      });
    } catch (error) {
      alert("登録されていない商品か、取得に失敗しました。");
      setBarcode(code);
      setProduct(null);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">POSレジ</h1>
          <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">ログアウト</button>
        </div>

        <ProductInfo code={barcode} name={product?.name || ""} price={product?.price || null} />

        <div className="flex flex-col gap-3 mt-4">
          <Link href="/scanner" className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold text-center">
            バーコードをスキャン
          </Link>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold">
            会計
          </button>
        </div>

        <CartList items={cart} />
      </div>
    </main>
  );
}