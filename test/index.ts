import express from 'express'
const app = express();
const PORT = 8000;


//var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer();
// var serverOne = 'http://localhost:3001',
//     ServerTwo = 'http://localhost:3002',
//     ServerThree = 'http://localhost:3002';

// app.all("/app1/*", function(req, res) {
//     console.log('redirecting to Server1');
//     apiProxy.web(req, res, {target: serverOne});
// });

// app.all("/app2/*", function(req, res) {
//     console.log('redirecting to Server2');
//     apiProxy.web(req, res, {target: ServerTwo});
// });

// app.all("/app2/*", function(req, res) {
//     console.log('redirecting to Server3');
//     apiProxy.web(req, res, {target: ServerThree});
// });

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/test/plop', (req, res) => res.send('test/plop route'));
app.get('/test/:next', (req, res) => {
    console.log(req.params.next)
    res.send('test route')
});
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});