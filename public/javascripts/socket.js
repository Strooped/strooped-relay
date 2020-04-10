
$('#connection').submit((evt) => {
  evt.preventDefault();

  const token = $('#coninput').val();

  const socket = io({
    query: { token }
  });

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

  socket.on('task:start', (msg) => {
    console.log(msg);
  });

  socket.on('task:answer', (msg) => {
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
