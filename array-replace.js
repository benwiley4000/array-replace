function arrayReplace (array, index, value) {
  var clone = array.slice();
  if (typeof index === 'object') {
    Object.keys(index).forEach(function (i) {
      clone[i] = index[i];
    });
  } else {
    clone[index] = value;
  }
  return clone;
}

arrayReplace.polyfill = function() {
  Array.prototype.replace = function replace (index, value) {
    return arrayReplace(this, index, value);
  };
};

if (typeof module !== 'undefined' && module) {
  module.exports = arrayReplace;
}
