const express = require('express');

const router = express.Router({
  mergeParams: true
});

const {
  protected,
  routRestrictOnlyBy
} = require('./../controllers/authUsercontroller');
const {
  getallReviews,
  createRiview,
  deleteReview
} = require('./../controllers/reviewcontroller');

router
  .route('/')
  .get(protected, getallReviews)
  .post(protected, routRestrictOnlyBy('user'), createRiview);

router.route('/:id').delete(protected, deleteReview);

module.exports = router;