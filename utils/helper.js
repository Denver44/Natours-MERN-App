import jwt from 'jsonwebtoken';

const spiltHelper = (source, breakWith, joinWith) =>
  source.split(breakWith).join(joinWith);

const createJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const milliSecondsToSeconds = (time) => parseInt(time.getTime() / 1000, 10);

export { spiltHelper, createJWTToken, milliSecondsToSeconds };
