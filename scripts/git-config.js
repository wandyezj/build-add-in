const { execSync } = require("child_process");

execSync("git config --local --add push.autoSetupRemote true");
