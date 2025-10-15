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
  const [lastScannedId, setLastScannedId] = useState<number | null>(null);

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
        setLastScannedId(null);
        throw new Error("Product not found");
      }

      const productData = await res.json();

      if (productData.prd_id === lastScannedId) {
        alert("同じ商品が連続でスキャンされました。");
      }
      setLastScannedId(productData.prd_id);

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
      setLastScannedId(null);
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
    <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6">
      <div className="w-full max-w-sm bg-surface shadow-lg rounded-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-text-primary">POSアプリ</h1>

        <Link
          href="/scanner"
          className="w-full flex items-center justify-center py-3 text-center bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-hover transition-transform transform hover:scale-105"
        >
          商品をスキャン
        </Link>

        <ProductInfo code={barcode} name={product?.name || ""} price={product?.price || null} />

        <CartList items={cart} onUpdateQty={handleUpdateQty} />

        <button
          onClick={() => alert(`購入処理は未実装です`)}
          className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-transform transform hover:scale-105 disabled:bg-gray-400"
          disabled={cart.length === 0}
        >
          購入する
        </button>
      </div>
    </main>
  );
}