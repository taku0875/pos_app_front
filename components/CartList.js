// components/CartList.js
import React from 'react';

const CartList = ({ cart }) => {
  const calculateSubtotal = (item) => item.price * item.quantity;

  return (
    <div className="cart-list">
      <h2 className="list-header">購入リスト</h2>
      {cart.length === 0 ? (
        <p>カートは空です。</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span className="item-name">{item.product_name} x {item.quantity}</span>
              <span className="item-price">{calculateSubtotal(item)}円</span>
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .cart-list {
          margin-bottom: 20px;
        }
        .list-header {
          font-size: 18px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .item-name {
          flex-grow: 1;
        }
        .item-price {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default CartList;