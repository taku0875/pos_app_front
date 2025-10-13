"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://app-002-gen10-step3-1-py-oshima9.azurewebsites.net";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ログインAPIを呼び出し
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      // 成功した場合、トークンを保存してトップページへ
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/";
      } else {
        setError("トークンが返されませんでした。");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err.response || err.message);
      setError("ユーザー名またはパスワードが違います。");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-lg w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">ログイン</h1>

        <label className="block mb-2 text-gray-700">ユーザー名</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <label className="block mb-2 text-gray-700">パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded-lg transition-colors"
        >
          ログイン
        </button>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
}