var assertType, define, isType, ref;

ref = require("type-utils"), isType = ref.isType, assertType = ref.assertType;

define = require("define");

module.exports = require("./exec");

define(module.exports, {
  isRepo: {
    lazy: function() {
      return require("./isRepo");
    }
  },
  status: {
    lazy: function() {
      return require("./status");
    }
  },
  branches: {
    lazy: function() {
      return require("./branches");
    }
  },
  currentBranch: {
    lazy: function() {
      return require("./currentBranch");
    }
  }
});

//# sourceMappingURL=../../../map/src/core/index.map
