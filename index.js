const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

let amount = 0;
let players = [
    { x: 0, y: -1, z: 0 },
    { x: 0, y: -1, z: 4 }
];

io.on('connection', (socket) => {
    amount++;
    console.log("user " + amount + " connected");

    socket.on('hi', (callback) => {
        if (amount > 1) {
            callback({
                amount: amount,
                players: players
            });
            socket.broadcast.emit("new-player", players);
        } else {
            callback({
                amount: amount
            });
        }
    });

    socket.on('move', function(id, pos) {
        console.log("player" + id + " is moving, new position: x: " + pos.x + " y: " + pos.y + " z: " + pos.z);
        players[id] = pos;

        socket.broadcast.emit("new-pos", id, pos);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
        amount--;
    });
});
