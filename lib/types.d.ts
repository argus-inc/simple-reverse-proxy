export interface Config {
    port: number;
    hostname: string;
    hasSSL?: boolean;
    pathCertificate?: string;
    pathPrivateKey?: string;
    environment: 'local' | 'dev' | 'live';
    servers: Server[];
}
export interface Server {
    route: string;
    destination: string;
}
