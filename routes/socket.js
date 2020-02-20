const SocketServer = require('socket.io');
const redisAdapter = require('socket.io-redis');

const rooms = {
  '223455': 'e92e95f8-71cc-455d-9426-07744ea2b83d',
  '102345': 'c4bad8e3-3145-461a-9d28-1e9cacfb856b',
  '987931': 'e29cc8f0-16c3-4c23-83ec-41224d77bf8d'
};

const getRoomId = (joinPin) => {
  return rooms[joinPin] || null;
}

const handleSocketConnection = (io, socket) => {
  const { token } = socket.handshake.query;
  console.log(`Client connected. Token: ${token}`);

  const roomId = getRoomId(token);

  socket.join(`room-${roomId}`);

  console.log(`RoomId: ${roomId}`);

  setTimeout(() => {
    io.emit('hello', 'to all clients');
    // Simulate that the game-master started a game in a game room using
    io
    .to(`room-${roomId}`)
    .emit('game:start', { roomId, message: 'Game-master has started the game' });

    // Check which clients are connected to this room
    io.in(`room-${roomId}`).clients((err, clients) => {
      console.log(clients); // an array containing socket ids in 'room-${roomId}'
    });
  }, 10000);

  // const interval = setInterval(() => {
  //   console.log('Notifying all listeners');
  //   io.emit('master:notify', { message: `Hello ${count}` })
  //   count++;
  // }, 3000);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('game message', (msg) => {
    console.log(msg);
  });
};

const initSocket = (server) => {
  const io = new SocketServer(server);
  io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

  // Authenticate connection
  // Will only run once per client-server connection
  io.use((socket, next) => {
    const { token } = socket.handshake.query;

    const roomId = getRoomId(token);

    console.log(`Token: ${token}, Room: ${roomId}`);

    if (!roomId) {
      return next(new Error('Invalid joinToken'));
    }

    next();
  });

  io.on('connection', socket => handleSocketConnection(io, socket));
};


module.exports = initSocket;
