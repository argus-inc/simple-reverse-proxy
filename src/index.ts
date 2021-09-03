import express from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import httpProxy from 'http-proxy'
import morgan from 'morgan'
import cors from 'cors';
const proxyServer = express();
//const PORT = 5000;


// const config = {
//     port: 5000,
//     hostname: 'pigstech.pixiumdigital.com',
//     hasSSL: false,
//     cert: '/etc/ssl/fullchain.crt',
//     key: '/etc/ssl/privkey.pem',
//     environment: 'local'
// }

const config = {
    port: 5000,
    hostname: 'pigstech.pixiumdigital.com',
    server: 'localhost:3000',
    hasSSL: true,
    cert: '/var/ssl/fullchain.pem',
    key: '/var/ssl/privkey.pem',
    environment: 'live'
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
    if (req.hostname === config.hostname) {
        return next()
    } else {
        res.sendStatus(401);
    }
}

const apiProxy = httpProxy.createProxyServer({
    //ignorePath: true,
});

//var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer();
const serverOne = 'http://localhost:3000'
//     ServerTwo = 'http://localhost:3002',
//     ServerThree = 'http://localhost:3002';

//proxyServer.use(urlencoded({ extended: true }));
//@ts-ignore
proxyServer.options('*', cors()) // include before other routes
proxyServer.use(cors());
proxyServer.use(morgan('common'));
proxyServer.disable('etag');
proxyServer.all('*', hostname);
apiProxy.on('proxyReq', function (proxyReq, req, res, options) {
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
});

proxyServer.all("/*", (req: any, res: any) => {
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


if (config.hasSSL) {
    const httpsServer = https.createServer(credentials, proxyServer);
    const server = httpsServer.listen(config.port, () =>
        console.log(`App is listening on port ${config.port}.`)
    );
    server.keepAliveTimeout = 3000;

} else {
    const httpServer = http.createServer(proxyServer);
    const server = httpServer.listen(config.port, () =>
        console.log(`App is listening on port ${config.port}.`)
    );
    //server.keepAliveTimeout = 3000;
}

// proxyServer.listen(PORT, () => {
//     console.log(`Listening on ${PORT}`)
// });