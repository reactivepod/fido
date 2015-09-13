module.exports = function isArray(value) {
  return Object.prototype.toString.apply(value) === '[object Array]';
};
