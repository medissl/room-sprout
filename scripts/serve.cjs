// Local preview only. Vercel serves the exported files in production.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const types = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain',
};
http
  .createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const resolved = path.resolve(root, `.${pathname}`);
      if (resolved !== root && !resolved.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      let file = resolved;
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        if (path.extname(pathname)) {
          response.writeHead(404).end();
          return;
        }
        file = path.join(root, 'index.html');
      }
      response.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(file).pipe(response);
    } catch {
      response.writeHead(400).end();
    }
  })
  .listen(4173, '127.0.0.1', () => console.log('RoomSprout preview: http://127.0.0.1:4173'));
