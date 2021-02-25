const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  image : {
    // type: String
    data: Buffer,
    contentType: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Image', messageSchema);