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
  const TAX_RATE = 0.1;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.round(subtotal * (1 + TAX_RATE));

  return (
    <div className="w-full bg-background mt-2 border border-border rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-3 text-center text-text-primary border-b border-border pb-2">お買い物リスト</h3>
      <div className="max-h-48 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <p className="text-text-secondary text-center py-4">商品をスキャンしてください</p>
        ) : (
          <ul className="text-base space-y-3">
            {items.map((item) => (
              <li key={item.product_id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-secondary">@{item.price.toLocaleString()}円</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-16 text-right text-text-primary">{(item.price * item.qty).toLocaleString()}円</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(item.product_id, item.qty - 1)} className="w-7 h-7 bg-gray-200 text-text-secondary rounded-full text-xl font-bold flex items-center justify-center hover:bg-gray-300 transition-colors">-</button>
                    <span className="w-5 text-center font-medium">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.product_id, item.qty + 1)} className="w-7 h-7 bg-primary text-white rounded-full text-xl font-bold flex items-center justify-center hover:bg-primary-hover transition-colors">+</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-border text-right space-y-1">
          <p className="text-text-secondary">税抜合計: <span className="font-medium text-text-primary">{subtotal.toLocaleString()}円</span></p>
          <p className="text-xl font-bold text-text-primary">税込合計: <span className="text-primary">{total.toLocaleString()}円</span></p>
        </div>
      )}
    </div>
  );
}