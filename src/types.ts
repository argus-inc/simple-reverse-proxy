import { config } from "process";

export interface Config {
    port: number
    hostname: string
    hasSSL?: boolean,
    pathCertificate: string
    pathPrivateKey: string
    environment: 'local' | 'dev' | 'live'
}

// const config = {
//     port: 5000,
//     hostname: 'pigstech.pixiumdigital.com',
//     server: 'localhost:3000',
//     hasSSL: true,
//     cert: '/var/ssl/fullchain.pem',
//     key: '/var/ssl/privkey.pem',
//     environment: 'live'
// }