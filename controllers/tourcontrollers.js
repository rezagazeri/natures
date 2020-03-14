const Tour = require('../models/modeltours');
const ApiFeachers = require('../utils/apiFeachers');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');

exports.getAlltours = catchError(async (req, res, next) => {
  const feachers = new ApiFeachers(Tour.find(), req.query)
    .filtering()
    .sort()
    .limitFields()
    .pagination();
  const tours = await feachers.query;
  res.status(200).json({
    statuse: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('can not find tour with id', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchError(async (req, res, next) => {
  const newTour = req.body;
  const tour = await Tour.create(newTour);
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.updateTour = catchError(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('can not find tour with id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.deleteTour = catchError(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('can not find tour with id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
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