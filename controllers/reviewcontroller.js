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
    if (!req.body.tours) req.body.tours = req.params.tourId;
    if (!req.body.users) req.body.users = req.user.id;
    next();
}

exports.createRiview = createOne(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);