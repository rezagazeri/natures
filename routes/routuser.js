const express = require('express');

const {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/usercontroller');

const {
  signup,
  login,
  forgotpasswort,
  ressetPasswort,
  protected,
  updatePasswort,
  routRestrictOnlyBy,
  logout
} = require('../controllers/authUsercontroller');

const router = express.Router();

router.route('/logout').get(logout);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotpasswort').post(forgotpasswort);
router.route('/resetPasswort/:token').patch(ressetPasswort);
router.route('/updatePasswort').patch(protected, updatePasswort);
router.route('/updateme').patch(protected, uploadUserPhoto, resizeUserPhoto, updateMe);
router.route('/deleteme').patch(protected, deleteMe);

router
  .route('/')
  .get(getAllusers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(protected, routRestrictOnlyBy('admin'), deleteUser);

module.exports = router;