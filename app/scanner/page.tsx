"use client";

import { useRouter } from "next/navigation";
import BarcodeScanner from "../../components/BarcodeScanner";

export default function ScannerPage() {
  const router = useRouter();

  const handleScanSuccess = (result: string) => {
    localStorage.setItem("scannedCode", result);
    router.push("/"); // スキャン成功後、トップページに戻る
  };

  return <BarcodeScanner onScanSuccess={handleScanSuccess} />;
}