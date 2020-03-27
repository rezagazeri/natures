const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');
const Tour = require('../models/modeltours');

exports.renderOverviewPage = catchError(async (req, res, next) => {
  // 1) get all tour from database
  const tours = await Tour.find();
  if (!tours) {
    return next(new AppError('tours can not find', 404));
  }
  // 2) prepare review content with tour data in overview.pug

  //3)render overview
  res.status(200).render('overview', {
    titel: 'review',
    tours
  });
});
exports.renderTourPage = catchError(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  res.status(200).render('tour', {
    titel: 'tour',
    tour
  });
});
