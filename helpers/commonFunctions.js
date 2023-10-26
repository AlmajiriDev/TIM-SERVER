module.exports = {
  parseBoolean: (bit) => {
    return !!Number(bit);
  },
  objToArray: (arg) => {
    return Object.values(arg);
  },
  emptyObject: (arg) => {
    if (Object.keys(arg).length === 0 && arg.constructor === Object) {
      return true;
    }
    return false;
  },
};
