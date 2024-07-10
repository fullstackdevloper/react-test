const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    movieTitle: {
        type: String,
        required: true,
        trim: true
    },
    publishingYear: {
        type: String,
        required: true
    },
    image:{
        type: String,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Movies = mongoose.models.movies || mongoose.model("movies", moviesSchema);

export default Movies;
