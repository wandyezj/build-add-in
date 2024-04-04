const fs = require("fs");

const icons = [
    ["Play", "regular", [16, 32, 48]],
    ["Edit", "regular", [16, 32, 48]],
    ["Hexagon", "regular", [16, 32, 48]],
];

const iconDirectory = "../../fluentui-system-icons/assets";
const iconDirectoryOut = "assets/fluent-svg";

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

`
ic_fluent_edit_16_regular.svg
ic_fluent_edit_32_regular.svg
ic_fluent_edit_48_regular.svg

ic_fluent_play_16_regular.svg
ic_fluent_play_32_regular.svg
ic_fluent_play_48_regular.svg
`.split("\n");
