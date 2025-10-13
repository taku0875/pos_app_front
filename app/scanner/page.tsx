"use client";

import { useRouter } from "next/navigation";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function ScannerPage() {
  const router = useRouter();

  /**
   * バーコードのスキャンが成功したときに呼び出される関数
   * @param result - スキャンされたバーコードの文字列
   */
  const handleScanSuccess = (result: string) => {
    // スキャン結果をブラウザのローカルストレージに保存
    localStorage.setItem("scannedCode", result);
    // トップページ (レジ画面) に戻る
    router.push("/");
  };

  return <BarcodeScanner onScanSuccess={handleScanSuccess} />;
}