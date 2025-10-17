// server.js
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.WEBSITE_PORT || process.env.PORT || 3000;

// 👇 dir: '.' を追加して、カレントディレクトリをプロジェクトルートとして指定します
// これが今回の問題を解決する唯一の鍵です。
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
    // このメッセージがログストリームに表示されれば起動成功です
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});