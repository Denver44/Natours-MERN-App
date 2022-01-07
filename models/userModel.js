import mongoose from 'mongoose';
import validator from 'validator';

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
  },
});

const User = mongoose.model('User', userSchema);
export default User;
