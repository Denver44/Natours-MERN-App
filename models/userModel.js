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

// eslint-disable-next-line consistent-return
userSchema.pre('save', async function (next) {
  // When we are changing username or email at that time we don't want to hash our password so for that this setup is used
  if (!this.isModified('password')) return next();

  // This means we are modifying password means we doing something with password field now it should be encrypted.
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // We don't want this field to persisted in our DB
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
