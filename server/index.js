const express = require("express");
const app = express();
const cors = require('cors')
const http = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(http);
const multer = require("multer")
require("dotenv").config()

dl  = require('delivery'),
fs  = require('fs');

app.use(express.json());
app.use(cors())

const port = process.env.PORT || 5000;

const Message = require("./Message");
var mongoose = require("mongoose");

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb Connection successful on prokart app");
});

app.use(express.static(path.join(__dirname, "..", "client", "build")));

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads')
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname)
  }
})

const upload = multer({storage: storage}).single('image')

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.post('/image', (req, res) => {
  upload(req, res, err => {
      if (err) {
          res.status(400).send("Something Went Wrong")
      }
      res.send(req.file)
      io.emit('uploaded image', req.file)
  })
})

const messageRoutes = require("./Routes")
app.use('/messages', messageRoutes)


io.on("connection", (socket) => {
  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.emit("init", messages);
    });

  socket.on('joining msg', (username) => {
    const name = username;
    // socket.broadcast.emit('cm', `---${name} joined the chat---`);
    // socket.emit('test', 'testing')
    io.emit('cm', `${name} has joined the Chat`)
  });

  

  // Listen to connected users for a new message.
  socket.on("message", (msg) => {
    const name = msg.name
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      name: msg.name,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit("push", msg);
  });
});

http.listen(port, () => {
  console.log("listening on Port:" + port);
});
