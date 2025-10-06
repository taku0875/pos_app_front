// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import ProductInfo from '../components/ProductInfo';
import CartList from '../components/CartList';

const API_BASE_URL = 'http://your-backend-server:3000/api/v1';

const PosPage = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    const code = prompt("バーコードまたはQRコードを入力してください:");
    if (code) {
      setScannedCode(code);
      await fetchProduct(code);
    }
  };

  const fetchProduct = async (code) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?code=${code}`);
      if (response.status === 404) {
        alert('商品が見つかりません');
        setProduct(null);
        return;
      }
      const data = await response.json();
      setProduct({ ...data, quantity: 1 });
    } catch (error) {
      console.error('商品検索エラー:', error);
      alert('エラー: 商品情報の取得に失敗しました。');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const existingItem = cart.find(item => item.product_id === product.prd_id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.product_id === product.prd_id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, {
          product_id: product.prd_id,
          product_code: product.code,
          product_name: product.name,
          price: product.price,
          tax_code: '10',
          quantity: 1,
        }]);
      }
      setProduct(null);
      setScannedCode('');
    }
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert('カートが空です');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sales/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pos_id: '90',
          store_id: '30',
          employee_id: '9999999999',
          items: cart,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        // Lv.2仕様に合わせて税込と税抜の両方を表示
        alert(`購入完了\n合計金額（税込）：${result.total_amount}円\n合計金額（税抜）：${result.total_amount_ex_tax}円`);
        
        // Lv.2仕様に合わせて画面をクリア
        setCart([]);
        setScannedCode('');
        setProduct(null);
      } else {
        alert(`購入失敗: ${result.detail || '購入処理に失敗しました。'}`);
      }
    } catch (error) {
      console.error('購入エラー:', error);
      alert('エラー: 購入処理中に問題が発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="container">
      <Head>
        <title>モバイルPOSアプリ</title>
      </Head>
      <h1 className="header">モバイルPOSアプリ</h1>

      <button onClick={handleScan}>スキャン (カメラ)</button>

      {isLoading && <p>読み込み中...</p>}

      <div className="infoArea">
        <span className="label">コード表示エリア:</span>
        <span className="value">{scannedCode}</span>
      </div>
      
      <ProductInfo product={product} onAddToCart={handleAddToCart} />
      
      <CartList cart={cart} />

      <div className="totalArea">
        <span className="totalText">合計 (税抜): {calculateTotal()}円</span>
      </div>

      <button onClick={handlePurchase} disabled={cart.length === 0}>購入</button>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: sans-serif;
        }
        .header {
          text-align: center;
        }
        .infoArea {
          margin: 20px 0;
        }
        .label {
          font-weight: bold;
        }
        .value {
          margin-left: 10px;
        }
        .totalArea {
          margin-top: 20px;
          border-top: 2px solid #333;
          padding-top: 10px;
          text-align: right;
        }
        .totalText {
          font-weight: bold;
          font-size: 18px;
        }
        button {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          cursor: pointer;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PosPage;