/**
 * Local HTTP static server for ./dist/ listening on 127.0.0.1:4173 (overridable via PORT).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function serve404(res) {
  const notFoundPath = path.join(DIST_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(notFoundPath).pipe(res);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

const server = http.createServer((req, res) => {
  if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${HOST}:${PORT}`).pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolvedPath = path.resolve(DIST_DIR, relativePath);

  if (
    !resolvedPath.startsWith(DIST_DIR + path.sep) ||
    path.basename(resolvedPath).toLowerCase() === '_headers'
  ) {
    serve404(res);
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      serve404(res);
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(resolvedPath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Preview server running at http://${HOST}:${PORT}`);
});
