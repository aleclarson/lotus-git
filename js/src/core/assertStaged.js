var hasChanges;

hasChanges = require("./hasChanges");

module.exports = function(modulePath) {
  return hasChanges(modulePath, {
    group: "staged"
  }).then(function(hasStagedChanges) {
    if (!hasStagedChanges) {
      throw Error("No changes are staged!");
    }
  });
};

//# sourceMappingURL=../../../map/src/core/assertStaged.map
