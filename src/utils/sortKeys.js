function sortKeys(obj) {
    if (Array.isArray(obj)) {
      return obj.map(sortKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
          result[key] = sortKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }
  
  module.exports = { sortKeys };