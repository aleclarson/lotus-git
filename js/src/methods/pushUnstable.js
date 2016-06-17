var addCommit, assertRepo, assertStaged, getCurrentBranch, getDateString, getLatestCommit, log, optionTypes, pushChanges, stageAll, undoLatestCommit;

log = require("log");

undoLatestCommit = require("../core/undoLatestCommit");

getCurrentBranch = require("../core/getCurrentBranch");

getLatestCommit = require("../core/getLatestCommit");

assertStaged = require("../core/assertStaged");

pushChanges = require("../core/pushChanges");

assertRepo = require("../core/assertRepo");

addCommit = require("../core/addCommit");

stageAll = require("../core/stageAll");

optionTypes = {
  modulePath: String
};

module.exports = function(options) {
  var force, message, modulePath, remoteName;
  modulePath = process.cwd();
  force = options.force != null ? options.force : options.force = options.f;
  message = options.m;
  remoteName = options.remote || options.r || "origin";
  return assertRepo(modulePath).then(function() {
    return stageAll(modulePath);
  }).then(function() {
    return assertStaged(modulePath);
  }).then(function() {
    message = getDateString() + (message ? log.ln + message : "");
    return addCommit(modulePath, message);
  }).then(function() {
    log.moat(1);
    log.gray("Pushing...");
    log.moat(1);
    return pushChanges({
      modulePath: modulePath,
      remoteName: remoteName,
      force: force
    }).fail(function(error) {
      if (/^fatal: The current branch [^\s]+ has no upstream branch/.test(error.message)) {
        return pushChanges({
          modulePath: modulePath,
          remoteName: remoteName,
          force: force,
          upstream: true
        });
      }
      throw error;
    }).then(function() {
      return getCurrentBranch(modulePath).then(function(currentBranch) {
        return getLatestCommit(modulePath, remoteName, currentBranch).then(function(commit) {
          log.moat(1);
          log.green("Push success! ");
          log.gray.dim(remoteName + "/" + currentBranch);
          log.moat(1);
          log.yellow(commit.id.slice(0, 7));
          log.white(" ", commit.message);
          return log.moat(1);
        });
      });
    }).fail(function(error) {
      return undoLatestCommit(modulePath).then(function() {
        if (error.message === "Must force push to overwrite remote commits!") {
          log.moat(1);
          log.red("Push failed!");
          log.moat(1);
          log.gray.dim("Must use ");
          log.white("--force");
          log.gray.dim(" when overwriting remote commits!");
          log.moat(1);
          return;
        }
        throw error;
      });
    });
  });
};

getDateString = function() {
  var array, date, day, hours, minutes, month;
  array = [];
  date = new Date;
  month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  array.push(month);
  day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  array.push("/", day);
  array.push("/", date.getFullYear());
  hours = date.getHours() % 12;
  array.push(" ", hours === 0 ? 12 : hours);
  minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  array.push(":", minutes);
  array.push(" ", date.getHours() > 12 ? "PM" : "AM");
  return array.join("");
};

//# sourceMappingURL=../../../map/src/methods/pushUnstable.map
