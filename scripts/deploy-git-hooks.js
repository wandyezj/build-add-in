const fs = require("fs");

// Git Hooks
// https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks

const hookName = "pre-push";
const hookPath = `.git/hooks/${hookName}`;
const hookScript = `#!/bin/sh

#
# ensure that style check passes before pushing
#

npm run style-check
style_exit_code=$?

echo "style exit code: $style_exit_code"

case $style_exit_code in
    0)
        echo "style check passed"
        ;;
    *)
        echo ""
        echo "Failed: npm run style-check"
        echo "run:"
        echo "npm run style"
        exit 1
        ;;
esac

exit 0
`;

fs.writeFileSync(hookPath, hookScript);
