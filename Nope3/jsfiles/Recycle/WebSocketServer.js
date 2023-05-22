// JavaScript source code
const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({ server });

wss.on('connection', function connection(ws) {
    wss.on(messase, function incoming(message) {
        console.log('Received: %s', message);
    });
    wss.send('Welcome');

});