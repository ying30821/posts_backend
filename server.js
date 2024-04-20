const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./header');
const { handleSuccess, handleError } = require('./handler');

const posts = [];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  const method = req.method;

  if (req.url === '/posts' && method === 'GET') {
    handleSuccess(res, posts);
    return;
  }
  if (req.url === '/posts' && method === 'POST') {
    req.on('end', () => {
      try {
        const post = JSON.parse(body);
        posts.push({
          id: uuidv4(),
          createAt: Date.now(),
          ...post,
        });
        handleSuccess(res, posts);
      } catch (err) {
        handleError(res, 400, 'Unexpected end of JSON input');
      }
    });
    return;
  }
  if (req.url === '/posts' && method === 'DELETE') {
    posts.splice(0);
    handleSuccess(res, posts);
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'DELETE') {
    const id = req.url.split('/posts/').pop();
    const index = posts.findIndex((post) => post.id === id);
    console.log(id, index);
    if (index === -1) {
      handleError(res, 400, 'id not found');
      return;
    }
    posts.splice(index, 1);
    handleSuccess(res, posts);
    return;
  }
  if (req.url.startsWith('/posts/') && method === 'PUT') {
    const id = req.url.split('/posts/').pop();
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
      handleError(res, 400, 'id not found');
      return;
    }
    req.on('end', () => {
      try {
        const post = JSON.parse(body);

        const { createAt } = posts[index];
        posts[index] = {
          id,
          createAt,
          ...post,
        };
        handleSuccess(res, posts);
      } catch (err) {
        handleError(res, 400, 'Unexpected end of JSON input');
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
server.listen(process.env.PORT || 8080);
