module.exports = function (url, response) {
  var link;
  if(response.LastEvaluatedKey) {
    var keys = Object.keys(response.LastEvaluatedKey);

    var last;
    //check if only key is id
    if(keys.length === 1 && keys[0] === 'id') {
      last = response.LastEvaluatedKey.id;
    } else {
      last = encodeURIComponent(JSON.stringify(response.LastEvaluatedKey));
    }
    link = url + '?_last=' + last + '; rel="next"';
  }

  return link;
};
