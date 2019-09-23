const path = require("path");
const express = require("express");
const httpError = require("http-errors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const cors = require("cors");
const routes = require("../routes/index.route");
const config = require("./config");
const expressValidator = require("express-validator");
const app = express();

var distDir = "../../dist/";
app.use(express.static(path.join(__dirname, distDir)));
app.use(/^((?!(api)).)*/, (req, res) => {
    res.sendFile(path.join(__dirname, distDir + "/index.html"));
});
console.log(distDir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(compress());
app.use(cors());
app.use("/api/", routes);
app.use((req, res, next) => {
    const err = new httpError(404);
    return next(err);
});
if (config.env === "development") {
    app.use(logger("dev"));
}
module.exports = app;
