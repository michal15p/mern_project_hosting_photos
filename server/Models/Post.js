const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let postSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String
  },
  description: {
    type: String
  },
  img: {
    type: String
  },
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }

}, {
    collection: 'posts'
  })
module.exports = mongoose.model('Post', postSchema)