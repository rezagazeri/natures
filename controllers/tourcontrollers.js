const Tour = require('../models/modeltours');
const catchError = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  getAll,
  getOne,
  createOne
} = require('./../controllers/handlerFactory');


exports.getAlltours = getAll(Tour);
exports.getTour = getOne(Tour, {
  path: 'reviews'
});
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getToursatats = catchError(async (req, res, next) => {
  const stats = await Tour.aggregate([{
      $match: {
        price: {
          $gte: 1000
        }
      }
    },
    {
      $group: {
        _id: null,
        numTour: {
          $sum: 1
        },
        avrRating: {
          $avg: '$ratingsAverage'
        },
        numRating: {
          $sum: '$ratingsAverage'
        },
        avrPrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = catchError(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([{
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourStarts: {
          $sum: 1
        },
        tours: {
          $push: '$name'
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});