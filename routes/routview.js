const express = require('express');

const router = express.Router({ mergeParams: true });
const { renderOverviewPage, renderTourPage } = require('./../controllers/viewController');

router.route('/').get(renderOverviewPage);
router.route('/tour/:slug').get(renderTourPage);

module.exports = router;
