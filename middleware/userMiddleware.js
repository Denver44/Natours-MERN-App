const setUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// eslint-disable-next-line import/prefer-default-export
export { setUserId };
