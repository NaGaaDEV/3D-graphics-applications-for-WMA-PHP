const router = require("express").Router();

const appController = require("../controller/app.controller.js");
const movieController = require("../controller/movie.controller.js");

router.route("/apps")
.get(appController.getAll)
.post(appController.addOne);

router.route("/apps/:appId")
.get(appController.getOne)
.put(appController.updateOne)
.delete(appController.deleteOne);

router.route("/apps/:appId/movies")
.get(movieController.getAll)
.post(movieController.addOne)

router.route("/apps/:appId/movies/:movieId")
.get(movieController.getOne)
.put(movieController.updateOne)
.delete(movieController.deleteOne)

module.exports = router;