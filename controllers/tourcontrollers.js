const Tour = require('../models/modeltours');
const AppError = require('./../utils/AppError');
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
///tours-whitin/:distance/center/:lnglat/unit/:unit
exports.getDistanceToursCenter = catchError(async (req, res, next) => {
  const {
    distance,
    lnglat,
    unit
  } = req.params;
  const [lat, lng] = lnglat.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lng || !lat) {
    return next(new AppError('please provide a valid lng and lat', 400));
  }
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat], radius
        ]
      }
    }
  });
  res.status(200).json({
    status: 'success',
    resualt: tours.length,
    data: {
      tours
    }
  });
});
exports.getAllTourDistances = catchError(async (req, res, next) => {
  const {
    lnglat,
    unit
  } = req.params;
  const [lat, lng] = lnglat.split(',');
  const multiplier = unit === 'mi' ? 0.0006213712 : 0.001;
  if (!lng || !lat) {
    return next(new AppError('please provide a valid lng and lat', 400));
  }
  const distances = await Tour.aggregate([{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});