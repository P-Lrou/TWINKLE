const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './index.html'));
});

app.get('/CSS/reset.css', (req, res) => {
  res.sendFile(join(__dirname, './CSS/reset.css'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(join(__dirname, './index.js'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('left_hand_coords', (data) => {
    io.emit('left_hand_coords', data);
  });
  socket.on('right_hand_coords', (data) => {
    io.emit('right_hand_coords', data);
  });
  socket.on('head_coords', (data) => {
    io.emit('head_coords', data);
  });
  socket.on('clap', (data) => {
    io.emit('clap', data);
  });
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
