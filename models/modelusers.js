const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'A User must have a username']
  },
  email: {
    type: 'string',
    required: [true, 'please enter a valid email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwort: {
    type: 'string',
    required: [true, 'please enter a valid password'],
    minlength: 8,
    select: false
  },
  confirmpasswort: {
    type: 'string',
    required: [true, 'please enter a valid password'],
    validate: {
      validator: function (value) {
        return value === this.passwort;
      },
      message: 'please corret passwort'
    }
  },
  photo: String,
  changePasswort: Date,
  resetPasswort: String,
  resetPasswortExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});
userSchema.pre(`/^find/`, function (next) {
  this.find({
    active: {
      $ne: false
    }
  });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('Passwort') || this.isNew) return next();
  this.changePasswort = Date.now() - 1000;
  next();
})
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwort')) return next();
  this.passwort = await bcrypt.hash(this.passwort, 12);
  this.confirmpasswort = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.checkchangePasswortAt = function (JWTtimstamp) {
  if (this.changePasswort) {
    const changepaswortstamp = parseInt(
      this.changePasswort.getTime() / 1000,
      10
    );
    return changepaswortstamp > JWTtimstamp;
  }
  return false;
};
userSchema.methods.createResetPasswortToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswort = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswortExpired = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;