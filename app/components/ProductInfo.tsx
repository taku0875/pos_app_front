"use client";

import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductInfoProps {
  product: Product;
  addToCart: (product: Product) => void;
}

export default function ProductInfo({ product, addToCart }: ProductInfoProps) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg bg-white transition duration-150 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 mb-2">¥{product.price.toLocaleString()}</p>
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium"
      >
        カートに追加
      </button>
    </div>
  );
}
