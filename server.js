const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const headers = require('./header');
const { handleSuccess, handleError } = require('./handler');
const Post = require('./model/post');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB);

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  const method = req.method;
  if (req.url === '/posts' && method === 'GET') {
    const posts = await Post.find();
    handleSuccess(res, posts);
    return;
  }
  if (req.url === '/posts' && method === 'POST') {
    req.on('end', async () => {
      try {
        const { name, content, type, image, ...field } = JSON.parse(body);
        const createPost = {
          name: name.trim(),
          content: content.trim(),
          type: type.trim(),
          image: image.trim(),
          ...field,
        };
        await Post.create(createPost);
        handleSuccess(res, createPost);
      } catch (err) {
        handleError(res, 400, err.message);
      }
    });
    return;
  }
  if (req.url === '/posts' && method === 'DELETE') {
    await Post.deleteMany();
    const posts = await Post.find();
    handleSuccess(res, posts);
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'DELETE') {
    const id = req.url.split('/posts/').pop();
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        handleError(res, 400, 'id not found');
        return;
      }
      handleSuccess(res, post);
    } catch (err) {
      handleError(res, 400, err.message);
    }
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split('/posts/').pop();
        const updatePost = await Post.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        handleSuccess(res, updatePost);
      } catch (err) {
        handleError(res, 400, err.message);
      }
    });
    return;
  }
  if (method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }
  handleError(res, 404, 'route not found');
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
