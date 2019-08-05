const express = require('express');
const bodyParser = require('body-parser');
const http = require('tp');
const session = require('express-session');
const socketIO = require('socket.io');
const router = require('express-promise-router')();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(router);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'thisisasecretkey',
  resave: true,
  saveUninitialized: true,
}))


// Routes
router.get('/', (req,res) => {
  res.send('Hi how are you?');
});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

router.get('/register', (req,res) => {
  res.sendFile(__dirname + '/register.html');
});

router.get('/group/:name', (req, res) => {
  const name = req.params.name;
  res.sendFile(__dirname + '/group.html');
})

// make a connection with the user from server side
io.on('connection',(socket) => {
  // on connect base
  socket.emit('wecome to Wedupp chat');
  socket.on('join', (params, callback) => {
    socket.join(params.room, () => {
      io.in(params.room).emit(params.message);
    })
  })
  // on disconnect base
  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })

  // when new message is received
  socket.on('create_message', (msg) => {
    io.emit('new message', msg)
  });
});

server.listen(process.env.PORT || 7777, () => {
  console.log('The server is live on port 7777');
})