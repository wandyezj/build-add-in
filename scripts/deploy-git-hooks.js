const fs = require("fs");

// Git Hooks
// https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks

const hookName = "pre-push";
const hookPath = `.git/hooks/${hookName}`;
const hookScript = `#!/bin/sh

# run style before commit
npm run style
`;

fs.writeFileSync(hookPath, hookScript);
