"use client";

import React from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartListProps {
  cart: CartItem[];
}

export default function CartList({ cart }: CartListProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">カート一覧</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">カートは空です。</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-3"
            >
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-800 font-medium">
                ¥{item.price.toLocaleString()} × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
        <span>合計</span>
        <span>¥{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
