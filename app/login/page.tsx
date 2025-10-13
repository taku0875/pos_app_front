"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("test1");
  const [password, setPassword] = useState("password001");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 パスワード表示用の状態を追加

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://app-002-gen10-step3-1-py-oshima9.azurewebsites.net";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/";
      } else {
        setError("トークンが返されませんでした。");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err.response || err.message);
      if(err.response?.status === 401) {
        setError("ユーザー名またはパスワードが違います。");
      } else {
        setError("ネットワークエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">ログイン</h1>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700">パスワード</label>
          {/* 👇 パスワード入力欄と表示ボタン */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 stateに応じてtypeを変更
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded pr-16"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // 👈 stateを切り替え
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              {showPassword ? "非表示" : "表示"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 w-full rounded-lg transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}