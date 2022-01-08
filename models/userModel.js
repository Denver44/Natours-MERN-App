/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
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
    lowercase: true,
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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
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

const User = mongoose.model('User', userSchema);
export default User;
