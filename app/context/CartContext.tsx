"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// カートアイテムの型定義
// ★ 他ファイルから import できるよう 'export' を追加
export interface CartItem {
  product_id: number;
  product_code: string;
  name: string;
  price: number;
  tax_code: string;
  quantity: number; // 'qty' から 'quantity' に変更
}

// Contextが提供する値の型定義
// ★ 他ファイルから import できるよう 'export' を追加
export interface CartContextType {
  cart: CartItem[];
  addToCart: (newItem: Omit<CartItem, "quantity">) => void;
  handleUpdateQty: (productId: number, newQty: number) => void;
  clearCart: () => void; // 'clearCart' を追加
}

// Contextを作成
const CartContext = createContext<CartContextType | undefined>(undefined);

// アプリ全体にContextを提供するためのProviderコンポーネント
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItemData: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === newItemData.product_id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === newItemData.product_id
            ? { ...item, quantity: item.quantity + 1 } // 'qty' から 'quantity' に変更
            : item
        );
      }
      return [...prevCart, { ...newItemData, quantity: 1 }]; // 'qty' から 'quantity' に変更
    });
  };

  const handleUpdateQty = (productId: number, newQty: number) => {
    setCart((cart) =>
      cart
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: newQty } : item
        ) // 'qty' から 'quantity' に変更
        .filter((item) => item.quantity > 0) // 'qty' から 'quantity' に変更
    );
  };

  // 'clearCart' 関数を実装
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, handleUpdateQty, clearCart }} // 'clearCart' を value に追加
    >
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