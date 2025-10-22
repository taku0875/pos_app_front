"use client";

// ★ 1. CartContextから 'CartItem' 型をインポート
import { CartItem } from "../context/CartContext";

// ★ 2. ローカルの 'CartItem' 型定義を削除
/*
interface CartItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
}
*/

interface CartListProps {
  items: CartItem[]; // ★ 3. 'items' はインポートした CartItem 型を参照する
  onUpdateQty: (productId: number, newQty: number) => void;
}

const TAX_RATE = 0.1;

export default function CartList({ items, onUpdateQty }: CartListProps) {
  // ★ 4. 'qty' を 'quantity' に変更
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.round(subtotal * (1 + TAX_RATE));

  return (
    <div className="w-full bg-white mt-2 border border-gray-200 rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold text-center text-gray-800 border-b border-gray-200 pb-2">
        お買い物リスト
      </h3>
      <div className="max-h-48 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            商品をスキャンしてください
          </p>
        ) : (
          <ul className="text-sm space-y-3">
            {items.map((item) => (
              <li
                key={item.product_id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    @{item.price.toLocaleString()}円
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-16 text-right text-gray-800">
                    {/* ★ 5. 'qty' を 'quantity' に変更 */}
                    {(item.price * item.quantity).toLocaleString()}円
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      // ★ 6. 'qty' を 'quantity' に変更
                      onClick={() =>
                        onUpdateQty(item.product_id, item.quantity - 1)
                      }
                      className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full text-xl font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    {/* ★ 7. 'qty' を 'quantity' に変更 */}
                    <span className="w-5 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      // ★ 8. 'qty' を 'quantity' に変更
                      onClick={() =>
                        onUpdateQty(item.product_id, item.quantity + 1)
                      }
                      className="w-7 h-7 bg-blue-500 text-white rounded-full text-xl font-bold flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 text-right space-y-1">
          <p className="text-sm text-gray-600">
            税抜合計:{" "}
            <span className="font-medium text-gray-800">
              {subtotal.toLocaleString()}円
            </span>
          </p>
          <p className="text-lg font-bold text-gray-800">
            税込合計: <span className="text-blue-600">{total.toLocaleString()}円</span>
          </p>
        </div>
      )}
    </div>
  );
}