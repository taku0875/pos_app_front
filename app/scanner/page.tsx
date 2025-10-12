"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BarcodeScanner from "../components/BarcodeScanner";

export default function ScannerPage() {
  const router = useRouter();

  // ✅ スキャン成功時の処理
  const handleScan = async (code: string) => {
    try {
      // FastAPIに問い合わせ（登録されているか確認）
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          alert("登録されていない商品です。");
          // ✅ トップ画面に戻る
          router.push("/");
          return;
        }
        throw new Error("商品検索に失敗しました。");
      }

      // 登録されている商品ならトップ画面へ渡す
      localStorage.setItem("scannedCode", code);
      router.push("/");
    } catch (err) {
      console.error("スキャンエラー:", err);
      alert("サーバー接続エラーが発生しました。");
      router.push("/"); // ✅ エラー時も安全に戻す
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-xl font-semibold mb-4">バーコードをスキャンしてください</h1>
      <BarcodeScanner onScanSuccess={handleScan} />
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
      >
        戻る
      </button>
    </main>
  );
}
