// components/ProductInfo.js
import React from 'react';

const ProductInfo = ({ product, onAddToCart }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="product-info">
      <div className="product-row">
        <span className="label">名称表示エリア:</span>
        <span className="value">{product.name}</span>
      </div>
      <div className="product-row">
        <span className="label">単価表示エリア:</span>
        <span className="value">{product.price}円</span>
      </div>
      <button onClick={onAddToCart}>追加</button>
      <style jsx>{`
        .product-info {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .product-row {
          display: flex;
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          width: 120px;
        }
        .value {
          flex-grow: 1;
        }
        button {
          margin-top: 10px;
          width: 100%;
          padding: 10px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ProductInfo;