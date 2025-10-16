"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// カートアイテムの型定義
interface CartItem {
  product_id: number;
  product_code: string;
  name: string;
  price: number;
  tax_code: string;
  qty: number;
}

// Contextが提供する値の型定義
interface CartContextType {
  cart: CartItem[];
  addToCart: (newItem: Omit<CartItem, 'qty'>) => void;
  handleUpdateQty: (productId: number, newQty: number) => void;
}

// Contextを作成
const CartContext = createContext<CartContextType | undefined>(undefined);

// アプリ全体にContextを提供するためのProviderコンポーネント
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItemData: Omit<CartItem, 'qty'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === newItemData.product_id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === newItemData.product_id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prevCart, { ...newItemData, qty: 1 }];
    });
  };

  const handleUpdateQty = (productId: number, newQty: number) => {
    setCart((cart) =>
      cart
        .map((item) => (item.product_id === productId ? { ...item, qty: newQty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, handleUpdateQty }}>
      {children}
    </CartContext.Provider>
  );
}

// Contextを簡単に使うためのカスタムフック
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}