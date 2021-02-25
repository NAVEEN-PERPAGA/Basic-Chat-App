const express = require("express");
const app = express();
const cors = require('cors')
const http = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(http);
const multer = require("multer")
const fs = require('fs')
const bodyParser = require('body-parser')
require("dotenv").config()

// dl  = require('delivery'),

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

const Msg = require("./Message");
const Image = require("./imageModel")
var mongoose = require("mongoose");

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb Connection successful...");
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

const upload = multer({
  storage: storage,
  limits: {fileSize: 25 * 1024 * 1024}
})

app.post('/image', upload.single('selected_image'), (req, res) => {
  // const file = req.file
  const file = req.body.selected_image
  // const base64 = req.body.selected_image
  // console.log(file)

  const new_message = new Msg({
  //   image: {
  //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.body.file.filename)),
  //     contentType: 'image/png'
  // }
    image: file
  })
  new_message.save()

  // const newImage = new Image()
  // newImage.image.data = fs.readFileSync(req.body.file.path)
  // newImage.image.contentType = 'image/png'
  // newImage.save()
  
  // upload(req, res, err => {
  //     if (err) {
  //         res.status(400).send("Something Went Wrong")
  //     }
  //     res.send(req.file)
  //     // console.log(req.file)
  //     io.emit('uploaded image', req.file)
  // })
})

const messageRoutes = require("./Routes")
app.use('/messages', messageRoutes)


io.on("connection", (socket) => {
  // Get the last 10 messages from the database.
  Msg.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .exec((err, messages) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.emit("init", messages);
    });

  // socket.on('joining msg', (username) => {
  //   const name = username;
  //   // socket.broadcast.emit('cm', `---${name} joined the chat---`);
  //   // socket.emit('test', 'testing')
  //   io.emit('cm', `${name} has joined the Chat`)
  // });


  // Listen to connected users for a new message.
  socket.on("message", (msg) => {
    const name = msg.name
    // Create a message with the content and the name of the user.
    const message = new Msg({
      content: msg.content,
      name: msg.name,
      type: msg.type,
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
