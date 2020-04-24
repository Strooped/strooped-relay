const socketService = require('../service/socketService');

const handleSocketConnection = async (io, socket) => {
  const { role } = socket.handshake.query;
  if (role === 'master') {
    await socketService.gameMasterConnection(io, socket);
  } else {
    await socketService.clientConnection(io, socket);
  }
};

module.exports = { handleSocketConnection };
