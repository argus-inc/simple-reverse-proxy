"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleReverseProxy = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const proxyServer = (0, express_1.default)();
//const PORT = 5000;
class SimpleReverseProxy {
    constructor(config) {
        this.generateProxyHeaders = () => {
            this.apiProxy.on('proxyReq', function (proxyReq, req, res, options) {
                proxyReq.setHeader('Access-Control-Allow-Origin', '*');
                proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
            });
        };
        this.generateRedirections = () => {
            this.config.servers.forEach(server => {
                this.proxyServer.all(server.route, (req, res) => {
                    console.log(` - Adding route ${server.route} to destination: ${server.destination}`);
                    this.apiProxy.web(req, res, { target: server.destination });
                });
            });
        };
        this.generateCredentials = () => {
            if (this.config.hasSSL && this.config.pathPrivateKey && this.config.pathCertificate) {
                this.proxyCredentials = {
                    key: fs_1.default.readFileSync(this.config.pathPrivateKey, 'utf8'),
                    cert: fs_1.default.readFileSync(this.config.pathCertificate, 'utf8')
                };
            }
        };
        this.generateWebServer = () => {
            if (this.config.hasSSL) {
                const httpsServer = https_1.default.createServer(this.proxyCredentials, this.proxyServer);
                this.webServer = httpsServer.listen(this.config.port, () => console.log(`App is listening on port ${this.config.port} for ${this.config.servers.length} routes.`));
                this.webServer.keepAliveTimeout = 3000;
            }
            else {
                const httpServer = http_1.default.createServer(this.proxyServer);
                this.webServer = httpServer.listen(this.config.port, () => console.log(`App is listening on port ${this.config.port} for ${this.config.servers.length} routes.`));
                this.webServer.keepAliveTimeout = 3000;
            }
        };
        this.handleHostname = (req, res, next) => {
            if (this.config.environment !== "live") {
                return next();
            }
            if (req.hostname === this.config.hostname) {
                return next();
            }
            else {
                res.sendStatus(401);
            }
        };
        this.config = config;
        this.proxyCredentials = {};
        this.generateCredentials();
        this.proxyServer = (0, express_1.default)();
        //@ts-ignore
        this.proxyServer.options('*', (0, cors_1.default)()); // include before other routes
        this.proxyServer.use((0, cors_1.default)());
        this.proxyServer.use((0, morgan_1.default)('common'));
        this.proxyServer.disable('etag');
        this.proxyServer.all('*', this.handleHostname);
        this.apiProxy = http_proxy_1.default.createProxyServer({
        //ignorePath: true,
        });
        this.generateProxyHeaders();
        this.generateRedirections();
        this.generateWebServer();
    }
}
exports.SimpleReverseProxy = SimpleReverseProxy;
