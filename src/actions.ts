// cspell:ignore SHOWTASKPANE HIDETASKPANE addin
console.log("actions load");

Office.actions.associate("SHOWTASKPANE", function () {
    console.log("shortcut - Show");
    return Office.addin
        .showAsTaskpane()
        .then(function () {
            return;
        })
        .catch(function (error) {
            return error.code;
        });
});

Office.actions.associate("HIDETASKPANE", async function () {
    debugger;
    console.log("shortcut - Hide");
    try {
        await Office.addin.hide();
    } catch (e) {
        console.log(e);
    }
});

Office.actions.associate("SETCOLOR", function () {
    console.log("shortcut - Set Color");
    Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.format.fill.load("color");

        await context.sync();
        const colors = ["#FFFFFF", "#C7CC7A", "#7560BA", "#9DD9D2", "#FFE1A8", "#E26D5C"];
        let colorIndex = colors.indexOf(range.format.fill.color);

        if (colorIndex == -1) {
            colorIndex = 0;
        } else if (colorIndex == colors.length - 1) {
            colorIndex = 0;
        } else {
            colorIndex++;
        }
        range.format.fill.color = colors[colorIndex];
        await context.sync();
    });
});

Office.onReady(() => {
    console.log("ready");
});
