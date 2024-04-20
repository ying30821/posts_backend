const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const headers = require('./header');
const { handleSuccess, handleError } = require('./handler');
const Post = require('./model/post');

dotenv.config({ path: './config.env' });
const DB = process.env.DATEBASE.replace(
  '<password>',
  process.env.DATEBASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('connect successfully');
  })
  .catch((error) => {
    console.log(error);
  });

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
        const post = JSON.parse(body);
        await Post.create({ ...post });
        const rooms = await Post.find();
        handleSuccess(res, rooms);
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
      await Post.findByIdAndDelete(id);
      const posts = await Post.find();
      handleSuccess(res, posts);
    } catch (err) {
      handleError(res, 400, err.message);
    }
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'PUT') {
    req.on('end', async () => {
      try {
        const post = JSON.parse(body);
        const id = req.url.split('/posts/').pop();
        await Post.findByIdAndUpdate(id, post);
        const posts = await Post.find();
        handleSuccess(res, posts);
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
