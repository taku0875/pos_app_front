// frontend/app/components/BarcodeScanner.tsx

"use client";

import React from "react";
// 'useZxing' という "Hook" をインポートします
import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({
  onScanSuccess,
  onClose,
}: BarcodeScannerProps) {
  // useZxing Hook を使って、スキャン成功時・エラー時の処理を定義します
  const { ref } = useZxing({
    onResult(result) {
      console.log("スキャン成功！", result.getText());
      onScanSuccess(result.getText());
    },
    onError(error) {
      // (カメラが見つからない、権限がないなどのエラーがここに表示される)
      console.error("スキャンエラー:", error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-sm rounded-lg overflow-hidden bg-black">
        {/* 映像を表示するための video タグ。ref={ref} でスキャナと連携させます */}
        <video ref={ref} className="w-full h-auto" />
      </div>

      <p className="text-white mt-4 text-lg font-bold">
        バーコードをカメラに向けてください
      </p>

      <button
        onClick={onClose}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
      >
        キャンセル
      </button>
    </div>
  );
}