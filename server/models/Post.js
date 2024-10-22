const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  creatorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  title: {
    type: String,
    required: false // Optional for non-project posts
  },
  link: {
    type: String,
    required: false // Optional for non-project posts
  },
  image: {
    type: String,
    required: false // Optional for non-project posts
  },
  description: {
    type: String,
    required: false // Optional for non-project posts
  },
  isProject: {
    type: Boolean,
    default: false, // Default is false, true for project showcase posts
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
