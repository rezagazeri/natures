const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/modelusers');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  getAll,
  getOne
} = require('./../controllers/handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('you must provide a image file', 400), false)
  }
}
const uploade = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

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


exports.uploadUserPhoto = uploade.single('photo');
exports.resizeUserPhoto = catchError(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({
    quality: 90
  }).toFile(`public/img/users/${req.file.filename}`)
  next();
})

exports.updateMe = catchError(async (req, res, next) => {
  //1) check req contain passwort or not if  yes ==error
  if (req.body.passwort || req.body.confirmpasswort) {
    return next(
      new AppError('you dont able send paasswort throw this route', 400)
    );
  }
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;
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