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
  deleteReview,
  updateReview,
  getReview,
  setToursandUser
} = require('./../controllers/reviewcontroller');

router
  .route('/')
  .get(protected, getallReviews)
  .post(protected, routRestrictOnlyBy('user'), setToursandUser, createRiview);

router
  .route('/:id')
  .get(protected, getReview)
  .delete(protected, deleteReview)
  .patch(protected, updateReview);

module.exports = router;