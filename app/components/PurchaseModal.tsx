// frontend/app/components/PurchaseModal.tsx

"use client";

import React from "react";

// モーダルに渡す金額データの型
interface PurchaseResult {
  totalPreTax: number; // 税抜合計
  totalAfterTax: number; // 税込合計
}

// コンポーネントが受け取るプロパティの型
interface PurchaseModalProps {
  isOpen: boolean; // ★ 1. 'isOpen' を受け取るように追加
  result: PurchaseResult | null; // 表示する金額データ
  onClose: () => void; // 「OK」ボタンが押された時に呼ばれる関数
}

export default function PurchaseModal({
  isOpen,
  result,
  onClose,
}: PurchaseModalProps) {
  
  // ★ 2. 'isOpen' が false なら何も表示しない (表示制御を親コンポーネントに任せる)
  if (!isOpen) return null;

  return (
    // 画面全体を覆う背景
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* モーダル本体 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs text-center">
        
        <h3 className="text-xl font-bold mb-4">購入完了</h3>
        
        {/* ★ 3. 'result' がある時だけ金額を表示 */}
        {result && (
          <div className="space-y-2 text-left mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">税抜合計:</span>
              <span className="font-bold text-lg">
                ¥{result.totalPreTax.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">合計金額 (税込):</span>
              <span className="font-bold text-lg text-red-600">
                ¥{result.totalAfterTax.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* OKボタン (要件11) */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          OK
        </button>

      </div>
    </div>
  );
}