const JWT = require('jsonwebtoken');
const {
  promisify
} = require('util');
const crypto = require('crypto');

const sendEmail = require('../utils/Email');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchAsync');
const User = require('../models/modelusers');

const createToken = id => {
  return JWT.sign({
      id
    },
    process.env.SECRET_CODE, {
      expiresIn: process.env.EXPIRE_TIME
    }
  );
};
const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  res.cookie('JWT', token, cookieOptions);
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      user
    }
  });
};
exports.signup = catchError(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    passwort: req.body.passwort,
    confirmpasswort: req.body.confirmpasswort,
    changePasswort: req.body.changePasswort,
    role: req.body.role
  });

  createSendToken(user, 201, res);
});

exports.login = catchError(async (req, res, next) => {
  const {
    username,
    passwort
  } = req.body;

  //1-check user und passwort send from client
  if (!username || !passwort) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2- check user und pass correct and exist
  const user = await User.findOne({
    username
  }).select('+passwort');
  if (!user || !(await user.correctPassword(passwort, user.passwort))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3-send token to client if evrything is correct
  createSendToken(user, 200, res);
});
exports.routRestrictOnlyBy = (...Roles) => {
  return (req, res, next) => {
    if (!Roles.includes(req.user.role)) {
      return next(new AppError('ypu have not permission to access', 403));
    }
    next();
  };
};
exports.protected = catchError(async (req, res, next) => {
  //1)get token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('you are not login .please get try to access . ', 401)
    );
  }

  //2)verification token
  const decoded = await promisify(JWT.verify)(token, process.env.SECRET_CODE);
  //3)check if user is still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('this user is not yet exist..!'));
  }
  //4)check if user passwort chang  or not when token issued
  if (freshUser.checkchangePasswortAt(decoded.iat)) {
    return next(
      new AppError('user recently changed passwort,please login again', 401)
    );
  }
  req.user = freshUser;
  next();
});
exports.forgotpasswort = catchError(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createResetPasswortToken();
  await user.save({
    validateBeforeSave: false
  });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request
   with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't
    forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.resetPasswort = undefined;
    user.resetPasswortExpired = undefined;
    await user.save({
      validateBeforeSave: false
    });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.ressetPasswort = catchError(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswort: resetToken,
    resetPasswortExpired: {
      $gt: Date.now()
    }
  });
  if (!user) {
    return next(new AppError('your token Invalid or expired', 400));
  }
  user.passwort = req.body.passwort;
  user.confirmpasswort = req.body.confirmpasswort;
  user.resetPasswort = undefined;
  user.resetPasswortExpired = undefined;
  await user.save({
    validateBeforeSave: false
  });
  createSendToken(user, 200, res);
});
exports.updatePasswort = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+passwort');
  if (!(await user.correctPassword(req.body.currentpasswort, user.passwort))) {
    return next(new AppError('passwort is not correct,try again', 401));
  }
  user.passwort = req.body.passwort;
  user.confirmpasswort = req.body.confirmpasswort;
  await user.save();
  createSendToken(user, 201, res);
});