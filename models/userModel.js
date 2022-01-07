/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Min length should be 8'],
    select: false, // As we don't want to show hash password to others. Security purpose
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password '],
    validate: {
      validator: function (el) {
        // This only work for ON SAVE!
        return el === this.password;
      },
      message: 'Confirm Password ({VALUE}) is not matching with password',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
});

// We can actually create a methods on UserSchema
userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  bcrypt.compare(candidatePassword, userPassword);

const User = mongoose.model('User', userSchema);
export default User;
