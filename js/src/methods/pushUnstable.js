var Promise, Repository, getDateString, os;

Repository = require("git-repo");

Promise = require("Promise");

os = require("os");

module.exports = function(args) {
  var options, ref, repo;
  options = {
    force: (ref = args.force) != null ? ref : args.f,
    remote: args.remote || args.r || "origin",
    message: args.m
  };
  repo = Repository(process.cwd());
  return repo.stageFiles("*").then(function() {
    return repo.isStaged().assert("No changes were staged!");
  }).then(function() {
    var message;
    message = getDateString();
    if (options.message) {
      message += os.EOL + message;
    }
    return repo.commit(message);
  }).then(function() {
    log.moat(1);
    log.gray("Pushing...");
    log.moat(1);
    return repo.pushBranch({
      force: options.force,
      remote: options.remote
    }).fail(function(error) {
      log.moat(1);
      log.red(error.stack);
      log.moat(1);
      if (/The current branch [^\s]+ has no upstream branch/.test(error.message)) {
        return repo.pushBranch({
          force: options.force,
          remote: options.remote,
          upstream: true
        });
      }
      throw error;
    }).then(function() {
      return repo.getBranch().then(function(currentBranch) {
        return repo.getHead(currentBranch, {
          remote: options.remote,
          message: true
        }).then(function(commit) {
          log.moat(1);
          log.green("Push success! ");
          log.gray.dim(options.remote + "/" + currentBranch);
          log.moat(1);
          log.yellow(commit.id.slice(0, 7));
          log.white(" ", commit.message);
          return log.moat(1);
        });
      });
    }).fail(function(error) {
      return repo.resetBranch("HEAD^").then(function() {
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
