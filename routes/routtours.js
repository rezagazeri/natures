const express = require('express');

const {
  getAlltours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getToursatats,
  getMonthlyPlan
} = require('./../controllers/tourcontrollers');
const {
  routRestrictOnlyBy,
  protected
} = require('./../controllers/authUsercontroller');
const reviewRouter = require('./../routes/routreview');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(protected, getAlltours)
  .post(createTour);
router.route('/get-alltoursstats').get(getToursatats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protected, routRestrictOnlyBy('admin', 'lead-guide'), deleteTour);

module.exports = router;