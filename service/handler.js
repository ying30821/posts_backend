const headers = require('./header');

const handleSuccess = (res, data) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data,
    })
  );
  res.end();
};
const handleError = (res, errorCode, message) => {
  res.writeHead(errorCode, headers);
  res.write(
    JSON.stringify({
      status: 'failed',
      message,
    })
  );
  res.end();
};

module.exports = { handleSuccess, handleError };
