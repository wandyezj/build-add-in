import React from "react";
import { useState } from "react";
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, ToolbarButton, Tooltip } from "@fluentui/react-components";

import { SnipWithSource } from "../core/Snip";
import { MoreHorizontal24Filled, DocumentFolderRegular, BookDefault28Regular } from "@fluentui/react-icons";
import { DrawerSnips } from "./ButtonOpen";
import { getId, idEditButtonOpenSnip } from "./id";
import { DrawerSamples } from "./ButtonSamples";

export function ButtonOpenMenu({ openSnip }: { openSnip: (snip: SnipWithSource) => void }) {
    const [isOpenLocal, setIsOpenLocal] = useState(false);
    const [isOpenDrawerSamples, setIsOpenDrawerSamples] = useState(false);

    return (
        <>
            <Menu openOnHover={true} hoverDelay={0}>
                <MenuTrigger>
                    <ToolbarButton
                        id={getId(idEditButtonOpenSnip)}
                        aria-label="More"
                        icon={<MoreHorizontal24Filled />}
                    ></ToolbarButton>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem icon={<DocumentFolderRegular />} onClick={() => setIsOpenLocal(true)}>
                            Local
                        </MenuItem>
                        <MenuItem icon={<BookDefault28Regular />} onClick={() => setIsOpenDrawerSamples(true)}>
                            Samples
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            <DrawerSnips openSnip={openSnip} isOpen={isOpenLocal} setIsOpen={setIsOpenLocal} />
            <DrawerSamples openSnip={openSnip} isOpen={isOpenDrawerSamples} setIsOpen={setIsOpenDrawerSamples} />
        </>
    );
}
