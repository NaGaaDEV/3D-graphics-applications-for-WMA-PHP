require("dotenv").config();
require("./api/data/db");
const routes = require("./api/router")

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

const logServerRunningPort = function(server) {
    console.log(process.env.MSG_SERVER_PORT, server.address().port);
}
const server = app.listen(process.env.PORT, () => logServerRunningPort(server));