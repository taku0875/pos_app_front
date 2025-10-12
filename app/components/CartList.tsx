"use client";

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface CartListProps {
  items: CartItem[];
}

export default function CartList({ items }: CartListProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="w-64 bg-white mt-4 border rounded-md p-2">
      <h3 className="font-semibold mb-2">購入リスト</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">商品がありません</p>
      ) : (
        <ul className="text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b py-1">
              <span>
                {item.name} ×{item.qty}
              </span>
              <span>{item.price * item.qty}円</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-right font-semibold">合計: {total}円</p>
    </div>
  );
}
