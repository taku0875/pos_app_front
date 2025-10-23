"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "./context/CartContext";
import CartList from "./components/CartList";
import ProductInfo from "./components/ProductInfo";
import PurchaseModal from "./components/PurchaseModal";

// ★ スキャン後の処理
function ScanHandler({ onScan }: { onScan: (code: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scannedCode = searchParams.get("scannedCode");
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (scannedCode && !hasProcessed.current) {
      hasProcessed.current = true;
      onScan(scannedCode);
      router.replace("/", { scroll: false }); // クエリ削除
    }
  }, [scannedCode, onScan, router]);

  return null;
}

// ★ 購入結果型
interface PurchaseResult {
  totalPreTax: number;
  totalAfterTax: number;
}

export default function Page() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<{ name: string; price: number } | null>(
    null
  );
  const { cart, addToCart, handleUpdateQty, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // ★ 商品スキャン処理
  const handleScan = async (code: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`
      );

      if (!res.ok) throw new Error("Product not found");

      const productData = await res.json();

      if (!productData || !productData.name) {
        throw new Error("Product data invalid");
      }

      setBarcode(code);
      setProduct({ name: productData.name, price: productData.price });

      // カートに追加
      addToCart({
        product_id: productData.prd_id, // ✅ product_idを格納
        product_code: productData.code,
        name: productData.name,
        price: productData.price,
        tax_code: "10",
      });
    } catch (error) {
      console.error(error);
      alert("登録されていない商品か、取得に失敗しました。");
    }
  };

  // ★ 複数商品購入処理
  const handlePurchase = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);

    // 税抜・税込金額計算
    const totalPreTax = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxRate = 0.1;
    const totalAfterTax = Math.floor(totalPreTax * (1 + taxRate));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((item) => ({
              product_id: item.product_id, // ✅ FastAPI側必須フィールド
              code: item.product_code,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            total: totalPreTax,
            totalWithTax: totalAfterTax,
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`サーバーエラー: ${errText}`);
      }

      const result = await res.json();
      console.log("購入成功:", result);

      // モーダル表示
      setPurchaseResult({ totalPreTax, totalAfterTax });
      setIsModalOpen(true);
      clearCart();
    } catch (error) {
      console.error("購入処理エラー:", error);
      alert("購入処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // ★ モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPurchaseResult(null);
    clearCart();
    setBarcode("");
    setProduct(null);
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

          {/* スキャン結果 */}
          <ProductInfo
            code={barcode}
            name={product?.name || ""}
            price={product?.price || null}
          />

          {/* カート一覧 */}
          <CartList items={cart} onUpdateQty={handleUpdateQty} />

          {/* 購入ボタン */}
          <button
            onClick={handlePurchase}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow disabled:bg-gray-400"
            disabled={cart.length === 0 || isLoading}
          >
            {isLoading ? "購入処理中..." : "購入"}
          </button>
        </div>
      </main>

      {/* 購入完了モーダル */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        result={purchaseResult}
      />
    </Suspense>
  );
}
