const mongoose = require("mongoose");
require("./app-model")

mongoose.connect(process.env.DB_URL);

const logDatabaseConnected = () => console.log(process.env.MSG_DATABASE_CONNECTED);
mongoose.connection.on("connected", () => logDatabaseConnected());

const logDatabaseDisconnected = () => console.log(process.env.MSG_DATABASE_DISCONNECTED);
mongoose.connection.on("disconnected", () => logDatabaseDisconnected());