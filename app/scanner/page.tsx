"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BarcodeScanner from "../components/BarcodeScanner";
import { useEffect } from "react";

export default function ScannerPage() {
  const router = useRouter();

  const handleScan = (code: string) => {
    localStorage.setItem("scannedCode", code);
    router.push("/");
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
