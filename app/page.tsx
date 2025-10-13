"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartList from "./components/CartList"; // 👈 パスを修正
import ProductInfo from "./components/ProductInfo"; // 👈 パスを修正

// カート内の商品の型定義
interface CartItem {
  product_id: number;
  product_code: string;
  name: string;
  price: number;
  tax_code: string;
  qty: number;
}

export default function Page() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<{ name: string; price: number } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // スキャナーから戻ったときにlocalStorageのスキャン結果を取得
  useEffect(() => {
    const scannedCode = localStorage.getItem("scannedCode");
    if (scannedCode) {
      localStorage.removeItem("scannedCode"); // 一度反映したら削除
      fetchAndAddToCart(scannedCode);
    }
  }, []);

  // 商品情報を取得し、カートに追加する関数
  const fetchAndAddToCart = async (code: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`);
      if (!res.ok) throw new Error("Product not found");

      const productData = await res.json();
      setBarcode(code);
      setProduct({ name: productData.name, price: productData.price });

      // カートに追加する新しいアイテム
      const newItem: CartItem = {
        product_id: productData.prd_id,
        product_code: productData.code,
        name: productData.name,
        price: productData.price,
        tax_code: "10", // 税コードを仮定
        qty: 1,
      };

      // カートの状態を更新
      setCart((prevCart) => {
        const existingItem = prevCart.find(item => item.product_id === newItem.product_id);
        if (existingItem) {
          // 既存のアイテムがあれば数量を増やす
          return prevCart.map(item =>
            item.product_id === newItem.product_id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        // 新しいアイテムを追加
        return [...prevCart, newItem];
      });

    } catch (error) {
      alert("登録されていない商品か、取得に失敗しました。");
      setBarcode(code);
      setProduct(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">モバイルPOSアプリ</h1>

      <Link
        href="/scanner"
        className="w-64 py-3 text-center bg-blue-500 text-white rounded-md font-semibold mb-4 hover:bg-blue-600"
      >
        スキャン（カメラ）
      </Link>

      <ProductInfo code={barcode} name={product?.name || ""} price={product?.price || null} />

      <CartList items={cart} />

      <button
        onClick={() => alert(`購入処理は未実装です`)}
        className="w-64 mt-4 py-3 bg-gray-800 text-white rounded-md font-semibold hover:bg-gray-700"
      >
        購入
      </button>
    </main>
  );
}