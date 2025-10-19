// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// 'production' 以外（開発環境など）かどうかを判定
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// ✅ Azureではポート8080固定。PORTが未定義でも8080で待機。
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Server ready on http://localhost:${port}`);
  });
});
