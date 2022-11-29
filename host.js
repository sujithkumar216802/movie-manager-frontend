const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = 5500;

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), '/');

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    console.log('URL : ' + url);
    if (url.endsWith('/') || url.endsWith('/login') || url.endsWith('/register') || url.endsWith('/logout') || url.endsWith('/edit') || url.endsWith('/add')) {
        const found = true;
        const streamPath = STATIC_PATH + 'index.html';
        const ext = path.extname(streamPath).substring(1).toLowerCase();
        const stream = fs.createReadStream(streamPath);
        return { found, ext, stream };
    }
    else {
        const filePath = path.join(...paths);
        const pathTraversal = !filePath.startsWith(STATIC_PATH);
        const exists = await fs.promises.access(filePath).then(...toBool);
        const found = !pathTraversal && exists;
        const streamPath = found ? filePath : STATIC_PATH + 'index.html';
        const ext = path.extname(streamPath).substring(1).toLowerCase();
        const stream = fs.createReadStream(streamPath);
        return { found, ext, stream };
    }
};

http.createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
