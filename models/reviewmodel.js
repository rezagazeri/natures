const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A tour must have a review']
    },
    rating: {
        type: 'Number',
        min: [1, 'rating must not be less than 1'],
        max: [5, 'rating must not be greater than 5']
    },
    riviewAt: {
        type: Date,
        default: Date.now()
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tours: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'users',
        select: 'username'
    }).populate({
        path: 'tours',
        select: 'name'
    });
    next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;