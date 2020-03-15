const catchError = require('../utils/catchAsync');
const Review = require('../models/reviewmodel');
const {
    deleteOne
} = require('./../controllers/handlerFactory');

exports.getallReviews = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId)
        filter = {
            tours: req.params.tourId
        };
    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    });
});
exports.createRiview = catchError(async (req, res, next) => {
    if (!req.body.tours) req.body.tours = req.params.tourId;
    if (!req.body.users) req.body.users = req.user.id;
    const newReview = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        users: req.body.users,
        tours: req.body.tours
    });
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});
exports.deleteReview = deleteOne(Review);