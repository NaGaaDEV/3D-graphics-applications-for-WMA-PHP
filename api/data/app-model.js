const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    trailer: String
}, { _id : true })

const appSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    initialReleaseDate: Date,
    movies: {
        type: [movieSchema]},
        default: []
})


mongoose.model(process.env.APP_MODEL, appSchema, process.env.APP_COLLECTION)