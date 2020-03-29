const catchError = require('../utils/catchAsync');
const Review = require('../models/reviewmodel');
const {
    deleteOne,
    updateOne,
    getAll,
    getOne,
    createOne
} = require('./../controllers/handlerFactory');

exports.getallReviews = getAll(Review);
exports.getReview = getOne(Review);

exports.setToursandUser = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createRiview = createOne(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);