"use client";

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface CartListProps {
  items: CartItem[];
}

const TAX_RATE = 0.1; // 税率10%

export default function CartList({ items }: CartListProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.round(subtotal * (1 + TAX_RATE)); // 税込み合計（四捨五入）

  return (
    <div className="w-full bg-gray-50 mt-6 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-center border-b pb-2">買い物かご</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">商品がありません</p>
      ) : (
        <ul className="text-base space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  @{item.price}円 × {item.qty}
                </p>
              </div>
              <span className="font-semibold">{item.price * item.qty}円</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 pt-4 border-t text-right">
        <p className="text-gray-600">税抜合計: {subtotal}円</p>
        <p className="text-xl font-bold">税込合計: {total}円</p>
      </div>
    </div>
  );
}