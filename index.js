const express = require('express');
const http = require('http');
const socketio = require('./utils/socketio');

const app = express();
const server = http.createServer(app);

socketio.initSocketServer(server)
const io = socketio.getIo()
let connectedClients = socketio.getConnectedClients()

io.on('connection', (socket) => {
    console.log('A user connected');

    // Generate a unique identifier for the connected client
    const clientId = socket.id;
    connectedClients[clientId] = socket;

    // Send a different message to each connected client every 3 seconds
    const interval = setInterval(() => {
        const timestamp = (new Date()).toLocaleTimeString();
        const message = `Message for client ${clientId},    ${timestamp}`;
        socket.emit('message', message);
    }, 3000);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete connectedClients[clientId];
        clearInterval(interval);
    });
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}: http://localhost:${port}`);
});