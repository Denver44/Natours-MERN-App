/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { milliSecondsToSeconds } from '../utils/helper.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Enter a valid Email Id'],
  },
  photo: {
    type: String,
    default: 'default.jpg', // A newUser will get a default image.
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Min length should be 8'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password '],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Confirm Password ({VALUE}) is not matching with password',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true, // Any user created will be active by default
    select: false, // We Don't want anybody know that we have this field.
  },
});

//  NOTE : Always comment ou the below two hooks when u r importing data otherwise hashed password will get hashed.

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
});

// To log the Date and Time After resetting password we create this hook.
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  return next();
});

userSchema.pre(/^find/, function (next) {
  // this point us to current user
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  bcrypt.compare(candidatePassword, userPassword);

// FIX THE TIME ISSUE
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    return JWTTimeStamp < milliSecondsToSeconds(this.passwordChangeAt);
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // THis token will be send to email ID as a OTP.
  const resetToken = crypto.randomBytes(32).toString('hex');

  // We will save this in our DB for a While to compare it.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes && this 10*60*1000 = 60000 MilliSeconds

  // console.log(
  //   { resetToken },
  //   this.passwordResetToken,
  //   this.passwordResetExpires
  // );

  return resetToken; // As we will send the un encrypted Token to user via email and then we compare it to check it is valid or not.
};

const User = mongoose.model('User', userSchema);
export default User;
