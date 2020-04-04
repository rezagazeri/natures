const express = require('express');

const {
  getAlltours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getToursatats,
  getMonthlyPlan,
  getDistanceToursCenter,
  getAllTourDistances,
  tourPhotosUpload,
  tourPhotoResize
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
router
  .route('/get-alltoursstats').get(getToursatats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/tours-whitin/:distance/center/:lnglat/unit/:unit')
  .get(getDistanceToursCenter);
router.route('/distances/:lnglat/unit/:unit').get(getAllTourDistances);


router
  .route('/:id')
  .get(getTour)
  .patch(protected, tourPhotosUpload, tourPhotoResize, updateTour)
  .delete(protected, routRestrictOnlyBy('admin', 'lead-guide'), deleteTour);

module.exports = router;