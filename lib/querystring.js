module.exports = function (queryString) {
  var options = {};

  if(queryString) {
    if(queryString.limit) {
      options.limit = decodeURIComponent(queryString.limit);
    }

    if(queryString.last) {
      options.last = decodeURIComponent(queryString.last);
    }

    if(queryString._filter) {
      options.filter = JSON.parse(decodeURIComponent(queryString._filter));
    }
  }

  return options;
};
