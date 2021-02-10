const express = require("express");
const app = express();
const multer= require('multer')
const http = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(http);
require("dotenv").config()

app.use(express.json());

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

  // Listen to connected users for a new message.
  socket.on("message", (msg) => {
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

const storage = multer.diskStorage({
  destination:(req,file,next)=>{
      next(null,'uploads')
  },
  filename:(req,file,next) =>{
      console.log(file)
      const {originalname}=file;
      next(null,originalname);
  }
})

const upload=multer({storage})

app.get('/',(req,res) =>{
  res.sendFile(__dirname + '/index.html');
});

app.post('/',upload.single('file-to-upload'),(req,res) =>{
  console.log("file uploaded")
  res.redirect('/');
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
