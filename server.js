const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (CSS, JS, images)
app.use(express.static(__dirname));

// Lobby route
app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

// Optional: root redirects to lobby
app.get('/', (req, res) => {
  res.redirect('/lobby');
});

// Simple WebSocket logic for players (customization)
let players = [];

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  socket.on('joinLobby', (playerData) => {
    players.push({ id: socket.id, ...playerData });
    io.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('updatePlayers', players);
    console.log('A player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
