var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8001, "0.0.0.0");

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var text = "initial text...";

io.sockets.on('connection', function (socket) {
  console.log('\n==> connection occurred')


  // EMIT
  socket.broadcast.emit('input:set', text);

  // WAIT
  socket.on('emited from client', function (clientObject) {
    console.log('\n==> emited from client:', clientObject);
  });
  // WAIT
  socket.on('input:change', function (value) {
    text = value;

    console.log('\n==> input:change:', value);
    socket.broadcast.emit('input:set', value);
  });
});