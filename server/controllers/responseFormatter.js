function resolveHeader(res) {
  res.setHeader('Content-Type', 'application/json');
}

function sendResponse(res, status, message, jwt) {
  const response = {
    message,
  };
  if (jwt) res.cookie('token', jwt);
  resolveHeader(res);
  res.status(status).send(response);
}
function badReqResponse(res) {
  sendResponse(res, 400, 'bad request');
}
function internalErrorResponse(res) {
  sendResponse(res, 500, 'some internal error occurred');
}

module.exports = { sendResponse, internalErrorResponse, badReqResponse };
