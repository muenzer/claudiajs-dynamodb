module.exports = function (url, response) {
  var link;
  if(response.LastEvaluatedKey) {
    link = url + '?last=' + response.LastEvaluatedKey + '; rel="next"';
  }

  return link;
};
