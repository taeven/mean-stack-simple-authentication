function formatResponse(res, resObj) {
  res.setHeader('Content-Type', 'application/json');
  res.response = JSON.stringify(resObj);
  return res;
}

function sendResponse(res, status, message) {
  const response = {
    message,
  };
  formatResponse(res, message);
  res.status(status).send(response);
}

function internalErrorResponse(res) {
  sendResponse(res, 500, 'some internal error occurred');
}
module.exports = { sendResponse, internalErrorResponse };
