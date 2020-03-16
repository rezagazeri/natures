const fs = require('fs');
const User = require('../models/modelusers');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  getAll,
  getOne
} = require('./../controllers/handlerFactory');


const Users = JSON.parse(
  fs.readFileSync(`${__dirname}/../data-dev/users.json`)
);
const filterObj = (InputObject, ...allowdfield) => {
  const newObj = {};
  Object.keys(InputObject).forEach(el => {
    if (allowdfield.includes(el)) newObj[el] = InputObject[el];
  });
  return newObj;
};
exports.getAllusers = getAll(User);
exports.getUser = getOne(User);

exports.createUser = (req, res) => {
  const newUser = req.body;
  res.status(201).json({
    status: 'success',
    data: {
      User: newUser
    }
  });
};

exports.deleteUser = deleteOne(User); //delete complete one user by Admin user
exports.updateUser = updateOne(User); //updade  one user by Admin user


exports.updateMe = catchError(async (req, res, next) => {
  //1) check req contain passwort or not if  yes ==error
  if (req.body.passwort || req.body.confirmpasswort) {
    return next(
      new AppError('you dont able send paasswort throw this route', 400)
    );
  }
  const filterBody = filterObj(req.body, 'username', 'email');
  //2)set data to database throw findbyid und fillter needed data
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.deleteMe = catchError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });
  res.status(204).json({
    status: 'success',
    data: null
  });
});