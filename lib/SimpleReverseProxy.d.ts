/// <reference types="node" />
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import { Config } from './types';
export declare class SimpleReverseProxy {
    config: Config;
    proxyServer: any;
    apiProxy: httpProxy;
    webServer?: https.Server | http.Server;
    proxyCredentials: {} | {
        key: string;
        cert: string;
    };
    constructor(config: Config);
    generateProxyHeaders: () => void;
    generateRedirections: () => void;
    generateCredentials: () => void;
    generateWebServer: () => void;
    handleHostname: (req: any, res: any, next: any) => any;
}
