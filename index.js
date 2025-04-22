const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors()); // ⚠️ En desarrollo
app.use(express.json());

let cola = [];

// Rutas
app.get('/cola', (req, res) => {
  res.json({ cola });
});

app.post('/cola', (req, res) => {
  const { nombre } = req.body;
  cola.push(nombre);
  io.emit('actualizarCola', cola);
  res.sendStatus(200);
});

app.post('/atender', (req, res) => {
  cola.shift();
  io.emit('actualizarCola', cola);
  res.sendStatus(200);
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Un cliente se conectó');
  socket.emit('actualizarCola', cola);

  socket.on('disconnect', () => {
    console.log('Un cliente se desconectó');
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});

app.use(express.static('public'))