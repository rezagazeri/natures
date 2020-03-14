const catchError = require('../utils/catchAsync');
const Review = require('../models/reviewmodel');

exports.getallReviews = catchError(async (req, res, next) => {
    const riviews = await Review.find();
    res.status(200).json({
        status: 'success',
        data: {
            riviews
        }
    })

});
exports.createRiview = catchError(async (req, res, next) => {
    const newRiview = await Review.create({
        riview: req.body.riview,
        rating: req.body.rating
    });
    res.status(201).json({
        status: 'success',
        data: {
            riview: newRiview
        }
    })
});