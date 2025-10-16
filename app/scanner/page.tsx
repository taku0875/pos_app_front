"use client";

import { useRouter } from "next/navigation";
import BarcodeScanner from "../components/BarcodeScanner";

export default function ScannerPage() {
  const router = useRouter();

  const handleScanSuccess = (result: string) => {
    if (result) {
      // スキャン結果をURLパラメータ(`?scannedCode=...`)としてメインページに渡します
      router.push(`/?scannedCode=${result}`);
    }
  };

  return <BarcodeScanner onScanSuccess={handleScanSuccess} />;
}