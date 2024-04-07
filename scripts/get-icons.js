//
// Copy svg icons
//
// From:
//  A local clone of: https://github.com/microsoft/fluentui-system-icons
//  git clone https://github.com/microsoft/fluentui-system-icons.git
//
// To:
// assets/fluent-svg

const fs = require("fs");

const icons = [
    ["Play", "regular", [16, 32, 48]],
    ["Edit", "regular", [16, 32, 48]],
    ["Hexagon", "regular", [16, 32, 48]],
];

const iconDirectory = "../../fluentui-system-icons/assets";
const iconDirectoryOut = "assets/fluent-svg";

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
        console.log(`${name}${fs.existsSync(source) ? "" : ` - NOT FOUND ${source}`}`);
        fs.copyFileSync(source, destination);
    });
});
