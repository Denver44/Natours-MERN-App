const spiltHelper = (source, breakWith, joinWith) =>
  source.split(breakWith).join(joinWith);

const milliSecondsToSeconds = (time) => parseInt(time.getTime() / 1000, 10);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
export { spiltHelper, milliSecondsToSeconds, filterObj };
