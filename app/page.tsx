"use client";

import React, { useState } from "react";
import CartList from "./components/CartList";
import BarcodeScanner from "./components/BarcodeScanner"; // 新しくインポート

// 商品データの型定義
interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

// カートアイテムの型定義
interface CartItem extends Product {
  quantity: number;
}

// バックエンドAPIのURL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://app-002-gen10-step3-1-py-oshima9.azurewebsites.net/api/v1";

export default function Page() {
  // State管理
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannedCode, setScannedCode] = useState<string>("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false); // スキャナの表示状態を管理

  // --- 関数定義 ---

  // バーコードをスキャンした時の処理
  const handleScan = async (code: string) => {
    setIsScannerOpen(false); // スキャナを閉じる
    setIsLoading(true);
    setError(null);
    setScannedCode(code);
    setScannedProduct(null);

    try {
      const res = await fetch(`${API_BASE_URL}/products/search?code=${code}`);
      if (!res.ok) {
        throw new Error("商品が見つかりませんでした。");
      }
      const data = await res.json();
      if (data && data.length > 0) {
        setScannedProduct(data[0]);
      } else {
        throw new Error("商品が見つかりませんでした。");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 「追加」ボタンを押した時の処理
  const handleAddToCart = () => {
    if (!scannedProduct) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === scannedProduct.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === scannedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...scannedProduct, quantity: 1 }];
    });
    setScannedCode("");
    setScannedProduct(null);
  };
  
  // 「購入」ボタンを押した時の処理
  const handlePurchase = () => {
    if(cart.length === 0) {
      alert("カートに商品がありません。");
      return;
    }
    alert(`${cart.length}点の商品を購入しました！`);
    setCart([]);
  }

  // --- UI部分 ---

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      {/* isScannerOpenがtrueの時だけスキャナを表示 */}
      {isScannerOpen && (
        <BarcodeScanner
          onScanSuccess={handleScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      <main className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
        
        {/* ① バーコードスキャンボタン */}
        <button
          onClick={() => setIsScannerOpen(true)} // ボタンクリックでスキャナを開く
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "商品検索中..." : "スキャン (カメラ)"}
        </button>

        {/* ... (残りのUI部分は変更なし) ... */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-2">
          <div className="bg-gray-100 p-3 rounded-md text-gray-800 text-center">{scannedCode || "コード"}</div>
          <div className="bg-gray-100 p-3 rounded-md text-gray-800 text-center">{scannedProduct?.name || "商品名"}</div>
          <div className="bg-gray-100 p-3 rounded-md text-gray-800 text-center">{scannedProduct ? `${scannedProduct.price}円` : "単価"}</div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!scannedProduct || isLoading}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition disabled:bg-gray-300"
        >
          追加
        </button>
        
        <div className="border-t pt-4">
          <CartList cart={cart} />
        </div>

        <button
          onClick={handlePurchase}
          disabled={cart.length === 0}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition disabled:bg-gray-300"
        >
          購入
        </button>
      </main>
    </div>
  );
}