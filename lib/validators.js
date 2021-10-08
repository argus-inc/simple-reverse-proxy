"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidator = exports.serverValidator = void 0;
const serverValidator = (obj) => {
    if (obj.route && obj.destination) {
        if (isString(obj.route)) {
            if (isString(obj.destination)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
exports.serverValidator = serverValidator;
const configValidator = (obj) => {
    let errors = [];
    if (!obj.port || (obj.port && !Number.isInteger(obj.port))) {
        errors.push(`Port is not defined or not a number`);
    }
    if (!obj.hostname || !isString(obj.hostname)) {
        errors.push(`Hostname is not defined or not a string`);
    }
    if (obj.hasSSL !== undefined && typeof obj.hasSSL !== "boolean") {
        errors.push(`hasSSL is not a boolean`);
    }
    if (obj.hasSSL && obj.hasSSl === true && !obj.pathCertificate) {
        errors.push(`hasSSl is set to true so pathCertificate should be set.`);
    }
    if (obj.hasSSL && obj.hasSSl === true && !obj.pathPrivateKey) {
        errors.push(`hasSSl is set to true so pathPrivateKey should be set.`);
    }
    if (obj.pathCertificate && !isString(obj.pathCertificate)) {
        errors.push(`pathCertificate is not defined or not a string`);
    }
    if (obj.pathCertificate && !isString(obj.pathPrivateKey)) {
        errors.push(`pathPrivateKey is not defined or not a string`);
    }
    if (obj.pathCertificate && !isString(obj.pathPrivateKey)) {
        errors.push(`pathPrivateKey is not defined or not a string`);
    }
    if (obj.environment && (obj.environment !== "local" && obj.environment !== "dev" && obj.environment !== "live")) {
        errors.push(`environment can only be equal to: local or dev or live`);
    }
    if (obj.servers && !Array.isArray(obj.servers)) {
        errors.push(`servers need to be an array`);
    }
    else if (obj.servers && Array.isArray(obj.servers) && obj.servers.length > 0) {
        obj.servers.forEach((server) => {
            if (!(0, exports.serverValidator)(server)) {
                errors.push(`servers are badly configured thery should be of form\n {
                    route: string
                    destination: string
                }`);
            }
        });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    else {
        return { valid: true, errors };
    }
};
exports.configValidator = configValidator;
// environment: 'local' | 'dev' | 'live',
// servers: Server[]
const isString = (str) => {
    if (typeof str === 'string' || str instanceof String) {
        return true;
    }
    return false;
};
