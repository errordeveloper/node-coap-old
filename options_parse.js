module.exports = function () {
  var Option = require ('./options');

  var parsed = {};
  var exports = {};

  exports.append = function (n, x) {

    if (Option.isDefined(n)) {
      if (Option.allowMultiple(n)) {
        if (!pasrsed.hasOwnProperty(Options.optionName(n)) {
          parsed[Options.optionName(n)] = [x];
        } else {
          parsed[Options.optionName(n)].push(x);
        }
      } else {
        parsed[Options.optionName(n)] = x;
      }
    } else { throw new Error("Option "+n+" is not defined!"); }
  }

  return exports;
}
