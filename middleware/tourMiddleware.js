const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = '_id,name,price,ratingsAverage,summary,difficulty';
  next();
};

export { aliasTopTours };
