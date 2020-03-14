const express = require('express');

const router = express.Router();

const {
    protected,
    routRestrictOnlyBy
} = require('../controllers/authUsercontroller');
const {
    getallReviews,
    createRiview
} = require('../controllers/riviewcontroller');

router.route('/').get(protected, getallReviews);

router.route('/users/:id/tours/:id').post(protected, routRestrictOnlyBy('user'), createRiview);

module.exports = router;