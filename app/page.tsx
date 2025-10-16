"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "./context/CartContext";
import CartList from "./components/CartList";
import ProductInfo from "./components/ProductInfo";

function ScanHandler({ onScan }: { onScan: (code: string) => void; }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scannedCode = searchParams.get("scannedCode");
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (scannedCode && !hasProcessed.current) {
      hasProcessed.current = true;
      onScan(scannedCode);
      router.replace("/", { scroll: false });
    }
  }, [scannedCode, onScan, router]);

  return null;
}

export default function Page() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<{ name: string; price: number } | null>(null);
  const { cart, addToCart, handleUpdateQty } = useCart();

  const handleScan = async (code: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`);
      if (!res.ok) { throw new Error("Product not found"); }
      const productData = await res.json();

      setBarcode(code);
      setProduct({ name: productData.name, price: productData.price });
      
      addToCart({
        product_id: productData.prd_id,
        product_code: productData.code,
        name: productData.name,
        price: productData.price,
        tax_code: "10",
      });
    } catch (error) {
      alert("登録されていない商品か、取得に失敗しました。");
    }
  };

  return (
    <Suspense fallback={null}>
      <main className="min-h-screen p-6 flex flex-col items-center">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-lg space-y-4">
          <ScanHandler onScan={handleScan} />
          <h1 className="text-2xl font-bold text-center text-gray-800">
            POSアプリ
          </h1>
          <Link
            href="/scanner"
            className="block w-full py-3 text-center bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow"
          >
            スキャン（カメラ）
          </Link>
          <ProductInfo
            code={barcode}
            name={product?.name || ""}
            price={product?.price || null}
          />
          <CartList items={cart} onUpdateQty={handleUpdateQty} />
          <button
            onClick={() => alert(`購入処理は未実装です`)}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow disabled:bg-gray-400"
            disabled={cart.length === 0}
          >
            購入
          </button>
        </div>
      </main>
    </Suspense>
  );
}