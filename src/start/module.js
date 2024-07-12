const fileUpload = require('express-fileupload');

const routes = require("../routes");
const connectionDb = require("../utils/connection");
const errorHandler = require("../middlewares/error-handler");

const modules = async (app, express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());
  await connectionDb();

  app.use("/api", routes);
  app.use(errorHandler);
};

module.exports = modules;
