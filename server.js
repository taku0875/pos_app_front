// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// 'production' 以外（開発環境など）かどうかを判定
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Azure App Service は自動的に PORT を設定します。
// ローカルで .env.local が読み込まれない場合や設定がない場合、フォールバックとして 3000 を使います。
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // URLをパースしてNext.jsのハンドラに渡す
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    // サーバーが起動したらログに出力
    console.log(`> Ready on http://localhost:${port}`);
  });
});