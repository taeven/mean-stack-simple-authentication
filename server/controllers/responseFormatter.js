function formatResponse(res, resObj) {
    res.setHeader("Content-Type", "application/json");
    res.response = JSON.stringify(resObj);
    return res;
}

module.exports = formatResponse;
