import React from "react";
import { useState } from "react";
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, ToolbarButton, Tooltip } from "@fluentui/react-components";

import { SnipWithSource } from "../core/Snip";
import {
    MoreVerticalRegular,
    DocumentFolderRegular,
    BookDefault28Regular,
    DocumentRegular,
} from "@fluentui/react-icons";
import { DrawerSnips } from "./DrawerSnips";
import { getId, idEditButtonOpenSnip } from "./id";
import { DrawerSamples } from "./DrawerSamples";
import { DrawerEmbed } from "./DrawerEmbed";
import { embedEnabled } from "../core/embedEnabled";

export function ButtonOpenMenu({ openSnip }: { openSnip: (snip: SnipWithSource) => void }) {
    const [isOpenLocal, setIsOpenLocal] = useState(false);
    const [isOpenDrawerSamples, setIsOpenDrawerSamples] = useState(false);
    const [isOpenDrawerEmbed, setIsOpenDrawerEmbed] = useState(false);

    return (
        <>
            <Menu openOnHover={true} hoverDelay={0}>
                <MenuTrigger>
                    <ToolbarButton id={getId(idEditButtonOpenSnip)} aria-label="More" icon={<MoreVerticalRegular />}>
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
