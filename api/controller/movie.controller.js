const mongoose = require("mongoose");

const app = mongoose.model(process.env.APP_MODEL);

module.exports.getAll = function(req, res) {
    let response = { status: 200, message: ""};
    const appId = req.params.appId;
    if(!appId) {
        response.status = 400;
        response.message = process.env.MSG_APP_ID_REQUIRED;
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_APP_ID;
    }

    const respond = function(err, result) {
        if(err) {
            res.status(500).json({message: err})
        } else {
            res.status(200).json(result.movies);
        }      
    }

    if(response.status == 200) {
        app.findById(appId).select("movies").exec((err, result) => respond(err, result));     
    } else {
        res.status(response.status).json({message: response.message});
    }   
}

module.exports.getOne = function(req, res) {
    let response = { status: 200, message: ""};
    const appId = req.params.appId;
    const movieId = req.params.movieId;
    if(!appId) {
        response.status = 400;
        response.message = process.env.MSG_APP_ID_REQUIRED;
    } else if(!movieId) {
        response.status = 400;
        response.message = process.env.MSG_MOVIE_ID_REQUIRED;
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_APP_ID;
    } else if(!mongoose.isValidObjectId(movieId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_MOVIE_ID;
    }

    const respond = function(err, result) {
        if(err) {
            res.status(500).json({message: err})
        } else if (!result || !result.movies || !result.movies.id(movieId)) {
            res.status(404).json({message: process.env.MSG_MOVIE_NOT_FOUND});
        } else {
            res.status(200).json(result.movies.id(movieId));
        }      
    }

    if(response.status == 200) {
        app.findById(appId).select("movies").exec((err, result) => respond(err, result));     
    } else {
        res.status(response.status).json({message: response.message});
    }
}

module.exports.addOne = function(req, res) {
    if(req.body && req.body.name) {
        const newApp = {
            name: req.body.name,
            initialReleaseDate: new Date(req.body.initialReleaseDate),
            movies: [req.body.movies]
        }

        const respond = function(err, result) {
            if(err) {
                res.status(500).json({message: err})
            } else {
                res.status(201).json({message: process.env.MSG_APP_ADDED});
            }
        }
        app.create(req.body, (err, result) => respond(err, result))
    } else {
        res.status(400).json({message: process.env.MSG_APP_NAME_REQUIRED})
    }
}

module.exports.updateOne = function(req, res) {
    let response = { status: 200, message: ""};
    const appId = req.params.appId;
    const movieId = req.params.movieId;
    if(!appId) {
        response.status = 400;
        response.message = process.env.MSG_APP_ID_REQUIRED;
    } else if(!movieId) {
        response.status = 400;
        response.message = process.env.MSG_MOVIE_ID_REQUIRED;
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_APP_ID;
    } else if(!mongoose.isValidObjectId(movieId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_MOVIE_ID;
    }

    const respond = function(err, result) {
        if(err) {
            response.status = 500;
            response.message = {message: err};
        } else {
            response.status = 200;
            response.message = {message: result};
        }
        res.status(response.status).json(response.message);
    }
    const updateMovie = function(err, result) {
        if(err) {
            respond(err, result)
        } else if (!result) {
            res.status(404).json({message: process.env.MSG_APP_NOT_FOUND});
        } else {
            if(!result.movies.id(movieId)) {
                res.status(404).json({message: process.env.MSG_MOVIE_NOT_FOUND});
            } else {
                result.movies.id(movieId).title = req.body.title;
                result.movies.id(movieId).trailer = req.body.trailer;
                result.save((err, result) => respond(err, result.movies.id(movieId)));                   
            }
        }
    }
    if(response.status == 200) {
        app.findById(appId).exec((err, result) => updateMovie(err, result));
    } else {
        res.status(response.status).json({message: response.message});
    }
}

module.exports.deleteOne = function(req, res) {
    let response = { status: 200, message: ""};
    const appId = req.params.appId;
    const movieId = req.params.movieId;
    if(!appId) {
        response.status = 400;
        response.message = process.env.MSG_APP_ID_REQUIRED;
    } else if(!movieId) {
        response.status = 400;
        response.message = process.env.MSG_MOVIE_ID_REQUIRED;
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_APP_ID;
    } else if(!mongoose.isValidObjectId(movieId)) {
        response.status = 400;
        response.message = process.env.MSG_INVALID_MOVIE_ID;
    }

    const respond = function(err, result) {
        if(err) {
            response.status = 500;
            response.message = {message: err};
        } else {
            response.status = 200;
            response.message = {message: process.env.MSG_MOVIE_DELETED};
        }
        res.status(response.status).json(response.message);
    }
    const deleteMovie = function(err, result) {
        if(err) {
            respond(err, result);
        } else if (!result) {
            res.status(404).json({message: process.env.MSG_APP_NOT_FOUND});
        } else {
            if(!result.movies.id(movieId)) {
                res.status(404).json({message: process.env.MSG_MOVIE_NOT_FOUND});
            } else {
                result.movies.id(movieId).remove();
                result.save((err, result) => respond(err, result));
            }
        }
    }
    if(response.status == 200) {
        app.findById(appId).select("movies").exec((err, result) => deleteMovie(err, result));
    } else {
        res.status(response.status).json({message: response.message});
    }
}