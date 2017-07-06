module.exports = function (queryString) {
  if(!queryString) {
    return {};
  }

  var options = {
    filter: {}
  };

  var pluralize = require('pluralize');

  Object.keys(queryString).forEach(function(key) {
    if(key.charAt(0) !== '_') {
      options.filter[key] = decodeURIComponent(queryString[key]);
    } else {
      switch(key) {
        case '_expand':
        case '_embed':
          options[key.substring(1)] = {};
          var name = decodeURIComponent(queryString._expand || queryString._embed);
          var singular = pluralize.singular(name);

          options[key.substring(1)].relLabel = name;
          options[key.substring(1)].relTable = pluralize(name);
          options[key.substring(1)].relId = singular + 'Id';
          break;
        case '_last':
          var last = decodeURIComponent(queryString[key]);

          try {
            options[key.substring(1)] = JSON.parse(last);
          } catch (e) {
            options[key.substring(1)] = {id: last};
          }
          break;
        default:
          options[key.substring(1)] = decodeURIComponent(queryString[key]);
      }
    }
  });
  //
  // if(queryString) {
  //   if(queryString._limit) {
  //     options.limit = decodeURIComponent(queryString._limit);
  //   }
  //
  //   if(queryString._last) {
  //     options.last = decodeURIComponent(queryString._last);
  //   }
  //
  //   if(queryString._filter) {
  //     options.filter = JSON.parse(decodeURIComponent(queryString._filter));
  //   }
  //
  //   if(queryString._expand) {
  //     options.expandLabel = decodeURIComponent(queryString._expand);
  //     options.expandTable = decodeURIComponent(queryString._expand) + 's';
  //     options.expandId = decodeURIComponent(queryString._expand) + 'Id';
  //   }
  // }

  if(Object.keys(options.filter).length === 0) {
    delete options.filter;
  }

  return options;
};
