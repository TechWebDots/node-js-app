// Simple "Hello World" Node.js application

const http = require('http');
const https = require('https');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

function fetchAzureFunction(callback) {
  https.get('https://fun-based-on-app-service.azurewebsites.net/health', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => { callback(null, data); });
  }).on("error", (err) => {
    callback(err);
  });
}

const server = http.createServer((req, res) => {
  fetchAzureFunction((err, azureResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    if (err) {
      res.end('Error calling Azure Function: ' + err.message);
    } else {
      res.end('Node JS app Calling Python Azure Function FastAPI; response coming as: ' + azureResponse);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});