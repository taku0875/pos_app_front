"use client";

import React from "react";
import Link from "next/link"; // 👈 Linkをインポート
import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onScanSuccess: (result: string) => void;
}

export default function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScanSuccess(result.getText());
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">バーコードをスキャンしてください</h2>
      <video ref={ref} className="w-full max-w-md rounded-lg border-4 border-gray-600" />
      {/* 👇 キャンセルして戻るためのボタンを追加 */}
      <Link href="/" className="mt-6 px-8 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-500 transition-colors">
        キャンセル
      </Link>
    </div>
  );
}