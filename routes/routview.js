const express = require("express");

const router = express.Router({
    mergeParams: true
});
const {
    renderOverviewPage,
    renderTourPage,
    renderLoginPage,
} = require("./../controllers/viewController");
const {
    isLoggesIn
} = require("./../controllers/authUsercontroller");


router.use(isLoggesIn);

router.route("/").get(renderOverviewPage);
router.route("/tour/:slug").get(renderTourPage);
router.route("/login").get(renderLoginPage);

module.exports = router;