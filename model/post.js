const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    tags: [{ type: String, required: [true, 'tag is required'] }],
    type: {
      type: String,
      required: [true, 'type is required'],
      enum: ['group', 'person'],
    },
    image: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'type is required'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
