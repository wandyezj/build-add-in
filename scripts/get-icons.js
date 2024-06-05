//
// Copy svg icons
//
// From:
//  A local clone of: https://github.com/microsoft/fluentui-system-icons
//  git clone https://github.com/microsoft/fluentui-system-icons.git
//
// To:
// assets/fluent-svg
//
// Icon Catalogue: https://react.fluentui.dev/?path=/docs/icons-catalog--page
//
const fs = require("fs");

const iconNames = ["Play", "Edit", "Hexagon", "Question", "Settings", "Script"];
const icons = iconNames.map((name) => [name, "regular", [16, 32, 48]]);

const iconDirectory = "../../fluentui-system-icons/assets";
const iconDirectoryOut = "assets/fluent-svg";

if (!fs.existsSync(iconDirectory)) {
    console.error(`Directory not found: ${iconDirectory}`);
    console.error(`
Please clone the repository next to this one:

git clone https://github.com/microsoft/fluentui-system-icons.git
    `);
    process.exit(1);
}

// Icon names follow a pattern:
// Example: ic_fluent_edit_16_regular.svg
// ic_fluent_[name]_[size]_regular.svg
// Available sizes are 16, 32, 48

icons.forEach(([iconName, iconStyle, iconSizes]) => {
    const path = `${iconDirectory}/${iconName}/SVG`;
    iconSizes.forEach((size) => {
        const name = `ic_fluent_${iconName.toLowerCase()}_${size}_${iconStyle}.svg`;
        const source = `${path}/${name}`;
        const destination = `${iconDirectoryOut}/${name}`;
        const exists = fs.existsSync(source);
        console.log(`${name}${exists ? "" : ` - NOT FOUND ${source}`}`);
        if (exists) {
            fs.copyFileSync(source, destination);
        }
    });
});
