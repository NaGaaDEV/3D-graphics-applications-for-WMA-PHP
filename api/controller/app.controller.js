const mongoose = require("mongoose");

const app = mongoose.model(process.env.APP_MODEL);

module.exports.getAll = function(req, res) {
    let count = parseInt(process.env.DEFAULT_FIND_COUNT);
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET);
    count = parseInt(req.query.count) < 10 ? parseInt(req.query.count) : count;
    offset = parseInt(req.query.offset) > 0 ? parseInt(req.query.offset) : offset;
    const respond = function(err, result) {
        if(err) {
            res.status(500).json({message: err})
        } else {
            res.status(200).json(result);
        }
    }
    app.find().skip(offset).limit(count).exec((err, result) => respond(err, result));
}

module.exports.getOne = function(req, res) {
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
            response.status = 500;
            response.message = {message: err};
        } else if (!result) {
            response.status = 404;
            response.message = {message: process.env.MSG_APP_NOT_FOUND};
        } else {
            response.message = result;
        }
        res.status(response.status).json(response.message);
    }

    if(response.status == 200) {
        app.findById(appId).exec((err, result) => respond(err, result));
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
    if(!appId) {
        response.status = 400;
        response.message = {message: process.env.MSG_APP_ID_REQUIRED}
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = {message: process.env.MSG_INVALID_APP_ID}
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
    if(response.status == 200) {
        app.findOneAndUpdate(appId, req.body).exec((err, result) => respond(err, result));
    } else {
        res.status(response.status).json({message: response.message});
    }
}

module.exports.deleteOne = function(req, res) {
    let response = { status: 200, message: ""};
    const appId = req.params.appId;
    if(!appId) {
        response.status = 400;
        response.message = {message: process.env.MSG_APP_ID_REQUIRED}
    } else if(!mongoose.isValidObjectId(appId)) {
        response.status = 400;
        response.message = {message: process.env.MSG_INVALID_APP_ID}
    }

    const respond = function(err, result) {
        if(err) {
            response.status = 500;
            response.message = {message: err};
        } else if(!result) {
            response.status = 400;
            response.message = {message: process.env.MSG_APP_NOT_FOUND};
        } else {
            response.status = 200;
            response.message = {message: process.env.MSG_APP_DELETED};
        }
        res.status(response.status).json(response.message);
    }
    if(response.status == 200) {
        app.findOneAndDelete(appId).exec((err, result) => respond(err, result));
    } else {
        res.status(response.status).json({message: response.message});
    }
}