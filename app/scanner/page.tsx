"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BarcodeScanner from "../components/BarcodeScanner";

export default function ScannerPage() {
  const router = useRouter();

  // ✅ スキャン成功時の処理
  const handleScan = async (code: string) => {
    try {
      // APIで商品登録の有無を確認
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?code=${code}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          alert("登録されていない商品です。");
          return; // 戻らずカメラを維持
        }
        throw new Error("商品検索に失敗しました");
      }

      // 登録されている商品ならトップページへ遷移
      localStorage.setItem("scannedCode", code);
      router.push("/");

    } catch (err) {
      console.error("スキャンエラー:", err);
      alert("サーバー接続エラーが発生しました。");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
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
