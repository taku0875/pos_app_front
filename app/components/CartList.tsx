"use client";

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartListProps {
  items: CartItem[];
  onUpdateQty: (productId: number, newQty: number) => void; // 👈 数量更新用の関数を受け取る
}

const TAX_RATE = 0.1;

export default function CartList({ items, onUpdateQty }: CartListProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.round(subtotal * (1 + TAX_RATE));

  return (
    <div className="w-full max-w-sm bg-gray-50 mt-4 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-center border-b pb-2">買い物かご</h3>
      <div className="max-h-48 overflow-y-auto"> {/* 👈 高さを制限してスクロール可能に */}
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">商品がありません</p>
        ) : (
          <ul className="text-sm space-y-2 pr-2">
            {items.map((item) => (
              <li key={item.product_id} className="flex justify-between items-center border-b py-1">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">@{item.price.toLocaleString()}円</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-12 text-right">{(item.price * item.qty).toLocaleString()}円</span>
                  {/* 👇 数量変更ボタンを追加 */}
                  <button onClick={() => onUpdateQty(item.product_id, item.qty - 1)} className="w-6 h-6 bg-gray-200 rounded-full text-lg font-bold flex items-center justify-center">-</button>
                  <span className="w-4 text-center">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.product_id, item.qty + 1)} className="w-6 h-6 bg-gray-200 rounded-full text-lg font-bold flex items-center justify-center">+</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-3 pt-3 border-t text-right">
        <p className="text-gray-600">税抜合計: {subtotal.toLocaleString()}円</p>
        <p className="text-lg font-bold">税込合計: {total.toLocaleString()}円</p>
      </div>
    </div>
  );
}