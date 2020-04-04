const express = require("express");

const router = express.Router({
    mergeParams: true
});
const {
    renderOverviewPage,
    renderTourPage,
    renderLoginPage,
    renderAcountPage
} = require("./../controllers/viewController");
const {
    isLoggesIn,
    protected
} = require("./../controllers/authUsercontroller");

router.route("/").get(isLoggesIn, renderOverviewPage);
router.route("/tour/:slug").get(isLoggesIn, renderTourPage);
router.route("/login").get(isLoggesIn, renderLoginPage);
router.route("/me").get(protected, renderAcountPage);

module.exports = router;