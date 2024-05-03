import { newDefaultSnip } from "../../core/newDefaultSnip";
import { saveCurrentSnipReference } from "../../core/storage";
import { saveSnip } from "../../core/database";
import { CodeTemplateBlock, CodeTemplateBlockParameterValue, getFilledTemplate } from "../CodeTemplateBlock";

export async function runBlocks(
    blocks: CodeTemplateBlock[],
    parameters: Record<string, CodeTemplateBlockParameterValue>[]
) {
    const code = blocks
        .map((block, index) => {
            const params = parameters[index];
            return getFilledTemplate(block.template, params);
        })
        .join("\n");
    console.log(code);

    // run code by overwriting a fixed snip and setting it as the current snip for the runner to pick up.
    const snipBlockId = "block";
    const snip = newDefaultSnip();
    snip.id = snipBlockId;
    // set the content of the script file
    snip.files["html"].content = "";
    snip.files["css"].content = "";
    snip.files["libraries"].content = "";
    snip.files["typescript"].content = code;

    await saveSnip(snip);
    saveCurrentSnipReference({ id: snipBlockId, source: "local" });
}
