const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  name: String,
  image : {
    type: String
  },
  meta_data : {}
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);