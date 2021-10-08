# Simple Reverse Proxy

This library makes it easy to configure multiple reverse proxies with a single config file.
The goal is to also make the library programmable so it can be used in code.

---

## Installation

You can install it globally with the following:

```
yarn global add @argus-inc/simple-reverse-proxy
```

You can also install it in a project with the following:

```
yarn add @argus-inc/simple-reverse-proxy
```

---

## Running

To run `simple-reverse-proxy` you can do the following globally:

```
simple-reverse-proxy --config="./myconfig.json"
```

If you are in a project you can simply do the following:

```
yarn simple-reverse-proxy
```

**The default file loaded is `srp.json` at the root of the project.**

---

## Configuration 

Here is a configuration example: 


```json
{
    "port": 8070,
    "hostname": "proxy.myapp.com",
    "hasSSL": false,
    "environment": "local",
    "servers": [
        {
            "route": "/test/*",
            "destination": "http://localhost:8000"
        }
    ]
}
```

Generic configuration:

- `port`: This is the port the proxy should run on.
- `hostname`: This is used if the `environment` is set to live. It is the hostname the proxy will be called.
- `hasSSL`: If SSL should be used. If this is set to true then you will need to specify: `pathCertificate, pathPrivateKey`.
- `environment`: Sets the current environment. This means for local the hostname will be ignored.
- `servers`: An array of server configurations.

Server configuration: 

- `route`: The proxy route that should be called for redirection
- `destination`: The destination of the traffic

Example: 

```json
{
    "route": "/test/*",
    "destination": "http://localhost:8000"
}
```

This will redirect for instance the request: 

RQ: GET http://127.0.0.1:8070/test/random
FW: GET http://localhost:8000/test/random

---

## Development

For development the few things to know are:

- Types go in the `src/types.ts` file.
- Interfaces, Classes, Enums comm capitalized for instance: `MyClass, ConfigType, MyCoolEnum`
- Function names and variables come non first character capitalized for instance: `myFunctionIsCool, myAwesomeUserVariable`

Make sure to comment your code.

For stesting locally there is a test server in `test/index.ts`

It can be started with the following command:

```
yarn tes
```

For starting the dev environement you can use: 

```
yarn dev
```

---

## Contributions

PRs are welcome to contribute to the project especially the ones tagged: `hacktoberfest`

Please follow the following standard for commits:

:emoji: action(namespace): Details

Examples:

🚀 deploy(package): Updating package.json configuration for deployment
🐛 fix(child-manager): Fix buffer overflow issue

More info for gitmoji here https://gitmoji.dev/

---

## Bugs & Issues

Please follow the creating an issue template for any bugs or problems

---

## Author

Burlet Mederic mederic.burlet@gmail.com

https://medericburlet.com

https://mederic.me