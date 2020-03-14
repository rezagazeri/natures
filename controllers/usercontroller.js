const fs = require('fs');
const User = require('../models/modelusers');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');

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
exports.getAllusers = (req, res) => {
  res.status(200).json({
    statuse: 'success',
    results: Users.length,
    data: {
      Users
    }
  });
};

exports.getUser = (req, res) => {
  const newid = req.params.id * 1;
  const newUser = Users.find(el => el.id === newid);
  res.status(201).json({
    status: 'success',
    data: {
      Users: newUser
    }
  });
};

exports.createUser = (req, res) => {
  const newUser = req.body;
  res.status(201).json({
    status: 'success',
    data: {
      User: newUser
    }
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id * 1;
  const user = Users.find(el => el.id === id);
  if (user) {
    const newUser = {
      user,
      ...req.body
    };
    res.status(201).json({
      status: 'success',
      data: {
        User: newUser
      }
    });
  }
};
exports.deleteUser = (req, res) => {
  const id = req.params.id * 1;
  const user = Users.find(el => el.id === id);
  if (user) {
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  }
};
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