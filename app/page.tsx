"use client";

import React, { useState } from "react";
import Link from "next/link";
import CartList from "./components/CartList";
import ProductInfo from "./components/ProductInfo";

export default function Page() {
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([]);

  // 商品情報取得（バックエンドAPIと連携想定）
  const fetchProduct = async (code: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`);
      const data = await res.json();
      setProductName(data.name);
      setPrice(data.price);
    } catch {
      alert("商品情報を取得できませんでした。");
    }
  };

  // スキャン結果を受け取る
  const handleScanned = (code: string) => {
    setBarcode(code);
    fetchProduct(code);
  };

  // カートに追加
  const handleAdd = () => {
    if (!productName || !price) return;
    const existing = cart.find((item) => item.name === productName);
    if (existing) {
      setCart(cart.map((item) =>
        item.name === productName ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { name: productName, price, qty: 1 }]);
    }
    setBarcode("");
    setProductName("");
    setPrice(null);
  };

  // 合計計算
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">モバイルPOSアプリ</h1>

      {/* ① スキャンボタン */}
      <Link
        href={`/scanner?prev=home`}
        className="w-64 py-3 text-center bg-blue-500 text-white rounded-md font-semibold mb-4 hover:bg-blue-600"
      >
        スキャン（カメラ）
      </Link>

      {/* ②〜④ 商品情報表示 */}
      <ProductInfo code={barcode} name={productName} price={price} />

      {/* ⑤ 追加ボタン */}
      <button
        onClick={handleAdd}
        className="w-64 mt-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        追加
      </button>

      {/* ⑥ 購入リスト */}
      <CartList items={cart} />

      {/* ⑦ 購入ボタン */}
      <button
        onClick={() => alert(`合計金額：${total.toLocaleString()}円（税込）`)}
        className="w-64 mt-4 py-3 bg-gray-800 text-white rounded-md font-semibold hover:bg-gray-700"
      >
        購入
      </button>
    </main>
  );
}
