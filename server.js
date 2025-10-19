const express = require("express");
const next = require("next");

const port = process.env.PORT; // ✅ Azure対応
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Server ready on http://localhost:${port}`);
  });
});
