const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  name: String,
  image : {
    type: String
    // data: Buffer,
    // contentType: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);