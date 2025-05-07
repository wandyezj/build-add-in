import React from "react";
import { useState } from "react";
import {
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    ToolbarButton,
} from "@fluentui/react-components";

import { SnipWithSource } from "../core/Snip";
import {
    FolderOpenRegular,
    DocumentFolderRegular,
    BookDefault28Regular,
    DocumentRegular,
    AddRegular,
    CodeBlockRegular,
    ArrowImportRegular,
} from "@fluentui/react-icons";
import { DrawerSnips } from "./DrawerSnips";
import { getId, idEditButtonOpen, idEditButtonOpenSnip } from "./id";
import { DrawerSamples } from "./DrawerSamples";
import { DrawerEmbed } from "./DrawerEmbed";
import { enableEmbed } from "../core/settings/enableEmbed";
import { newDefaultSnip } from "../core/newDefaultSnip";
import { LogTag, log } from "../core/log";
import { DrawerGists } from "./DrawerGists";
import { enableGists } from "../core/settings/enableGists";
import { enableSamples } from "../core/settings/enableSamples";
import { loc } from "../core/localize/loc";

export function ButtonOpenMenu({
    openSnip,
    openImportDialog,
}: {
    openSnip: (snip: SnipWithSource) => void;
    openImportDialog: () => void;
}) {
    const [isOpenLocal, setIsOpenLocal] = useState(false);
    const [isOpenDrawerSamples, setIsOpenDrawerSamples] = useState(false);
    const [isOpenDrawerEmbed, setIsOpenDrawerEmbed] = useState(false);
    const [isOpenDrawerGists, setIsOpenDrawerGists] = useState(false);

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
                    <ToolbarButton data-testid={getId(idEditButtonOpen)} aria-label="Open" icon={<FolderOpenRegular />}>
                        {loc("Open")}
                    </ToolbarButton>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList hasIcons={true}>
                        <MenuItem
                            data-testid={getId(idEditButtonOpenSnip)}
                            icon={<DocumentFolderRegular />}
                            onClick={() => setIsOpenLocal(true)}
                        >
                            {loc("Local")}
                        </MenuItem>

                        <MenuDivider />

                        <MenuItem icon={<AddRegular />} onClick={buttonNewSnip}>
                            {loc("New")}
                        </MenuItem>

                        {enableEmbed() ? (
                            <MenuItem icon={<DocumentRegular />} onClick={() => setIsOpenDrawerEmbed(true)}>
                                {loc("Embed")}
                            </MenuItem>
                        ) : (
                            <></>
                        )}

                        {enableGists() ? (
                            <MenuItem icon={<CodeBlockRegular />} onClick={() => setIsOpenDrawerGists(true)}>
                                {loc("Gist")}
                            </MenuItem>
                        ) : (
                            <></>
                        )}

                        {enableSamples() ? (
                            <MenuItem icon={<BookDefault28Regular />} onClick={() => setIsOpenDrawerSamples(true)}>
                                {loc("Sample")}
                            </MenuItem>
                        ) : (
                            <></>
                        )}

                        <MenuDivider />

                        <MenuItem icon={<ArrowImportRegular />} onClick={openImportDialog}>
                            {loc("Import")}
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            <DrawerSnips openSnip={openSnip} isOpen={isOpenLocal} setIsOpen={setIsOpenLocal} />
            <DrawerSamples openSnip={openSnip} isOpen={isOpenDrawerSamples} setIsOpen={setIsOpenDrawerSamples} />
            {enableEmbed() ? (
                <DrawerEmbed openSnip={openSnip} isOpen={isOpenDrawerEmbed} setIsOpen={setIsOpenDrawerEmbed} />
            ) : (
                <></>
            )}
            {enableGists() ? (
                <DrawerGists openSnip={openSnip} isOpen={isOpenDrawerGists} setIsOpen={setIsOpenDrawerGists} />
            ) : (
                <></>
            )}
        </>
    );
}
