const headers = require('../service/header');
const { handleError } = require('../service/handler');

const http = {
  cors(req, res) {
    res.writeHead(200, headers);
    res.end();
  },
  notFound(req, res) {
    handleError(res, 404, 'route not found');
  },
};

module.exports = http;
