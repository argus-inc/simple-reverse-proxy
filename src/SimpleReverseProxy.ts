import express from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import httpProxy from 'http-proxy'
import morgan from 'morgan'
import cors from 'cors';
import { Config } from './types'
const proxyServer = express();
//const PORT = 5000;

export class SimpleReverseProxy {
    config: Config
    proxyServer: any
    apiProxy: httpProxy
    webServer?: https.Server | http.Server
    proxyCredentials: {} | { key: string, cert: string }
    constructor(config: Config) {
        this.config = config
        this.proxyCredentials = {}
        this.generateCredentials()
        this.proxyServer = express()
        //@ts-ignore
        this.proxyServer.options('*', cors()) // include before other routes
        this.proxyServer.use(cors());
        this.proxyServer.use(morgan('common'));
        this.proxyServer.disable('etag');
        this.proxyServer.all('*', this.handleHostname);
        this.apiProxy = httpProxy.createProxyServer({
            //ignorePath: true,
        });
        this.generateProxyHeaders()
        this.generateRedirections()
        this.generateWebServer()
    }

    generateProxyHeaders = () => {
        this.apiProxy.on('proxyReq', function (proxyReq, req, res, options) {
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
            proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        });
    }

    generateRedirections = () => {
        this.config.servers.forEach(server => {
            this.proxyServer.all(server.route, (req: any, res: any) => {
                console.log(` - Adding route ${server.route} to destination: ${server.destination}`);
                this.apiProxy.web(req, res, { target: server.destination });
            });
        });

    }

    generateCredentials = () => {
        if (this.config.hasSSL && this.config.pathPrivateKey && this.config.pathCertificate) {
            this.proxyCredentials = {
                key: fs.readFileSync(this.config.pathPrivateKey, 'utf8'),
                cert: fs.readFileSync(this.config.pathCertificate, 'utf8')
            }
        }
    }

    generateWebServer = () => {
        if (this.config.hasSSL) {
            const httpsServer = https.createServer(this.proxyCredentials, this.proxyServer);
            this.webServer = httpsServer.listen(this.config.port, () =>
                console.log(`App is listening on port ${this.config.port} for ${this.config.servers.length} routes.`)
            );
            this.webServer.keepAliveTimeout = 3000;

        } else {
            const httpServer = http.createServer(this.proxyServer);
            this.webServer = httpServer.listen(this.config.port, () =>
                console.log(`App is listening on port ${this.config.port} for ${this.config.servers.length} routes.`)
            );
            this.webServer.keepAliveTimeout = 3000;
        }
    }

    handleHostname = (req: any, res: any, next: any) => {
        if (this.config.environment !== "live") {
            return next()
        }
        if (req.hostname === this.config.hostname) {
            return next()
        } else {
            res.sendStatus(401);
        }
    }

}
