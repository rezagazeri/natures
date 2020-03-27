/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const Tour = require('./modeltours');

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
  reviewAt: {
    type: Date,
    default: Date.now
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
    select: 'name'
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([{
      $match: {
        tours: tourId
      }
    },
    {
      $group: {
        _id: '$tours',
        nRating: {
          $sum: 1
        },
        avgRating: {
          $avg: '$rating'
        }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tours);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  next();
})
reviewSchema.post(/^findOneAnd/, async function () {
  await this.rev.constructor.calcAverageRatings(this.rev.tours)

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;