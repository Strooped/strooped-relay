
$('#connection').submit((evt) => {
  evt.preventDefault();

  const token = $('#coninput').val();
  const username = $('#username').val();
  const role = $('#role').val();

  let socket;

  if (typeof username !== "undefined") {
    socket = io({
      query: {token, username}
    });
  } else if (typeof role !== "undefined") {
    socket = io({
      query: {token, role}
    });
  }
  if (typeof socket === "undefined") {
    throw new HttpError;
  }

  socket.on('connect', () => {
    console.log('connected')
    console.log(socket.id);

    window.socket = { id: socket.id };
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error', err);
    $('#error').html(err);
  });

  socket.on('error', (err) => {
    console.error('Some error', err);
    $('#error').html(err);
  });

  socket.on('game:start', (msg) => {
    console.log(msg);
  });

  socket.on('game:ending', (msg) => {
    console.log(msg);
  });

  socket.on('round:ending', (msg) => {
    console.log(msg);
  });

  socket.on('task:start', (msg) => {
    console.log(msg);
  });

  socket.on('task:ending', () => {
    console.log('task:ending');
  });

  socket.on('task:answer', (msg) => {
    console.log(msg);
  });

  socket.on('player:joined', (msg) => {
    console.log(msg);
  });

  socket.on('hello', (msg) => {
    console.log(`Hello ${msg}`);
  });

  $('#chat').submit((evt) => {
    evt.preventDefault();

    console.log('Form submitted');
    console.log(`Message ${$('#m').val()}`);
    socket.emit($('#type').val(), $('#m').val());

    // Clear value
    $('#m').val('');
    $('#type').val('');
  });
});

// console.log('Listening on game start')
// socket.on('master:notify', (msg) => {
//   console.log(msg);

//   $('#history').append(`<p>${msg.message}</p>`);
// });
