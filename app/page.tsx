"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartList from "./components/CartList";
import ProductInfo from "./components/ProductInfo";

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
  const [lastScannedId, setLastScannedId] = useState<number | null>(null); // 👈 最後にスキャンした商品IDを記憶

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
      if (!res.ok) {
        setLastScannedId(null); // 👈 エラー時はリセット
        throw new Error("Product not found");
      }

      const productData = await res.json();

      // 👇 連続スキャンチェック
      if (productData.prd_id === lastScannedId) {
        alert("同じ商品が連続でスキャンされました。");
      }
      setLastScannedId(productData.prd_id); // 👈 スキャンした商品IDを記憶

      setBarcode(code);
      setProduct({ name: productData.name, price: productData.price });

      const newItem: CartItem = {
        product_id: productData.prd_id,
        product_code: productData.code,
        name: productData.name,
        price: productData.price,
        tax_code: "10",
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
      setLastScannedId(null); // 👈 エラー時はリセット
    }
  };
  
  const handleUpdateQty = (productId: number, newQty: number) => {
    setCart(cart => 
      cart
        .map(item => (item.product_id === productId ? { ...item, qty: newQty } : item))
        .filter(item => item.qty > 0)
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">モバイルPOSアプリ</h1>

      <Link
        href="/scanner"
        className="w-full max-w-sm py-3 text-center bg-blue-500 text-white rounded-md font-semibold mb-4 hover:bg-blue-600"
      >
        スキャン（カメラ）
      </Link>

      <ProductInfo code={barcode} name={product?.name || ""} price={product?.price || null} />

      <CartList items={cart} onUpdateQty={handleUpdateQty} />

      <button
        onClick={() => alert(`購入処理は未実装です`)}
        className="w-full max-w-sm mt-4 py-3 bg-gray-800 text-white rounded-md font-semibold hover:bg-gray-700"
      >
        購入
      </button>
    </main>
  );
}
