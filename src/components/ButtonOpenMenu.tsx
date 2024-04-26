import React from "react";
import { useState } from "react";
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, ToolbarButton } from "@fluentui/react-components";

import { SnipWithSource } from "../core/Snip";
import {
    FolderOpenVerticalRegular,
    DocumentFolderRegular,
    BookDefault28Regular,
    DocumentRegular,
    AddRegular,
} from "@fluentui/react-icons";
import { DrawerSnips } from "./DrawerSnips";
import { getId, idEditButtonOpenSnip } from "./id";
import { DrawerSamples } from "./DrawerSamples";
import { DrawerEmbed } from "./DrawerEmbed";
import { embedEnabled } from "../core/embedEnabled";
import { newDefaultSnip } from "../core/newDefaultSnip";
import { LogTag, log } from "../core/log";

export function ButtonOpenMenu({ openSnip }: { openSnip: (snip: SnipWithSource) => void }) {
    const [isOpenLocal, setIsOpenLocal] = useState(false);
    const [isOpenDrawerSamples, setIsOpenDrawerSamples] = useState(false);
    const [isOpenDrawerEmbed, setIsOpenDrawerEmbed] = useState(false);

    const buttonNewSnip = () => {
        log(LogTag.ButtonNew, "button - new snip");
        const newSnip = newDefaultSnip();
        // Open without saving, only save once there is an edit
        openSnip({ ...newSnip, source: "local" });
    };

    return (
        <>
            <Menu openOnHover={true} hoverDelay={0}>
                <MenuTrigger>
                    <ToolbarButton
                        id={getId(idEditButtonOpenSnip)}
                        aria-label="Open"
                        icon={<FolderOpenVerticalRegular />}
                    >
                        Open
                    </ToolbarButton>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem icon={<DocumentFolderRegular />} onClick={() => setIsOpenLocal(true)}>
                            Local
                        </MenuItem>
                        {embedEnabled() ? (
                            <MenuItem icon={<DocumentRegular />} onClick={() => setIsOpenDrawerEmbed(true)}>
                                Embed
                            </MenuItem>
                        ) : (
                            <></>
                        )}
                        <MenuItem icon={<BookDefault28Regular />} onClick={() => setIsOpenDrawerSamples(true)}>
                            Sample
                        </MenuItem>
                        <MenuItem icon={<AddRegular />} onClick={buttonNewSnip}>
                            New
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            <DrawerSnips openSnip={openSnip} isOpen={isOpenLocal} setIsOpen={setIsOpenLocal} />
            <DrawerSamples openSnip={openSnip} isOpen={isOpenDrawerSamples} setIsOpen={setIsOpenDrawerSamples} />
            {embedEnabled() ? (
                <DrawerEmbed openSnip={openSnip} isOpen={isOpenDrawerEmbed} setIsOpen={setIsOpenDrawerEmbed} />
            ) : (
                <></>
            )}
        </>
    );
}
