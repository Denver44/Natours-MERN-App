import { spiltHelper } from './helper.js';

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // We will the query on which we have to perform this all feature
    this.queryString = queryString; // Mongoose Query which we get in req.query that is queryString
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const tourSortQuery = spiltHelper(this.queryString.sort, ',', ' ');
      this.query = this.query.sort(tourSortQuery);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const tourLimitQuery = spiltHelper(this.queryString.fields, ',', ' ');
      this.query = this.query.select(tourLimitQuery);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
