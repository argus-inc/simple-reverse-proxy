import express from 'express'
import fs from 'fs'
import httpProxy from 'http-proxy'
import morgan from 'morgan'
const proxyServer = express();
const PORT = 5000;


const config = {
    port: 5000,
    hostname: 'pigstech.pixiumdigital.com',
    hasSSL: false,
    cert: '/etc/ssl/fullchain.crt',
    key: '/etc/ssl/privkey.pem',
    environment: 'local'
}

let credentials = {}

if (config.hasSSL) {
    const privateKey = fs.readFileSync(config.key, 'utf8');
    const certificate = fs.readFileSync(config.cert, 'utf8');
    credentials = { key: privateKey, cert: certificate };

}


const hostname = (req: any, res: any, next: any) => {
    if (config.environment !== "live") {
        return next()
    }
    if (req.hostname === 'list-it.me') {
        return next()
    } else {
        res.sendStatus(401);
    }
}

const apiProxy = httpProxy.createProxyServer({
    prependPath: false,
});

//var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer();
const serverOne = 'http://localhost:8000'
//     ServerTwo = 'http://localhost:3002',
//     ServerThree = 'http://localhost:3002';

//proxyServer.use(urlencoded({ extended: true }));
proxyServer.use(morgan('common'));
proxyServer.disable('etag');
proxyServer.all('*', hostname);

proxyServer.all("/test/*", (req: any, res: any) => {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, { target: serverOne });
});

// app.all("/app2/*", function(req, res) {
//     console.log('redirecting to Server2');
//     apiProxy.web(req, res, {target: ServerTwo});
// });

// app.all("/app2/*", function(req, res) {
//     console.log('redirecting to Server3');
//     apiProxy.web(req, res, {target: ServerThree});
// });

//proxyServer.get('/', (req, res) => res.send('Express + TypeScript Server'));

proxyServer.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});