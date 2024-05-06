const HttpControllers = require('../controllers/http');
const PostsControllers = require('../controllers/posts');

const routes = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  const method = req.method;
  if (req.url === '/posts' && method === 'GET') {
    PostsControllers.getPosts(req, res);
    return;
  }
  if (req.url === '/posts' && method === 'POST') {
    req.on('end', async () => PostsControllers.createPost({ body, res }));
    return;
  }
  if (req.url === '/posts' && method === 'DELETE') {
    PostsControllers.deleteAllPosts(req, res);
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'DELETE') {
    PostsControllers.deletePost(req, res);
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'PATCH') {
    req.on('end', async () => PostsControllers.editPost({ body, req, res }));
    return;
  }
  if (method === 'OPTIONS') {
    HttpControllers.cors(req, res);
    return;
  }
  HttpControllers.notFound(req, res);
};

module.exports = routes;
