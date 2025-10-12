"use client";

import React from "react";
import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onScanSuccess: (result: string) => void;
}

export default function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScanSuccess(result.getText());
    },
    onDecodeError(error) {
      console.warn("スキャン失敗:", error);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">バーコードをスキャンしてください</h2>
      <video ref={ref} className="w-full max-w-md rounded-lg border-4 border-gray-600" />
    </div>
  );
}
