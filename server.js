// server.js
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
// Azureの環境変数 `WEBSITE_PORT` を優先的に読み込む設定
const port = process.env.WEBSITE_PORT || process.env.PORT || 3000;

// Next.jsアプリのインスタンスを作成
const app = next({ dev, hostname, port, dir: '.' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Server error:", err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    // サーバーが起動したらログを出力
    // 開発環境では http://localhost:3000 でアクセスできます
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});