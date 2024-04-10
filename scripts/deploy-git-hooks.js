const fs = require("fs");

// cspell:ignore esac

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
        echo ""
        echo "pass: style check"
        echo ""
        ;;
    *)
        echo ""
        echo "FAIL: npm run style-check"
        echo "run:"
        echo "npm run style"
        exit 1
        ;;
esac

npm run spell-check
spell_exit_code=$?

echo "spell exit code: $spell_exit_code"

case $spell_exit_code in
    0)
        echo ""
        echo "pass: spell check"
        echo ""
        ;;
    *)
        echo ""
        echo "FAIL: npm run spell-check"
        echo "Fix the spelling issues."
        echo "    To ignore specific words:"
        echo "    // cspell:ignore wordToIgnore"
        exit 1
        ;;
esac

exit 0
`;

fs.writeFileSync(hookPath, hookScript);
