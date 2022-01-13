const spiltHelper = (source, breakWith, joinWith) =>
  source.split(breakWith).join(joinWith);

const milliSecondsToSeconds = (time) => parseInt(time.getTime() / 1000, 10);

export { spiltHelper, milliSecondsToSeconds };
