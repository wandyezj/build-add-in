import React, { useRef, useState } from "react";
import PaintCanvas, { PaintCanvasHandle } from "./demo/PaintCanvas";
import { createRoot } from "react-dom/client";
import {
    ColorArea,
    ColorPicker,
    ColorSlider,
    Dialog,
    DialogContent,
    DialogSurface,
    DialogTitle,
    FluentProvider,
    Toolbar,
    ToolbarButton,
    webLightTheme,
} from "@fluentui/react-components";

type HsvColor = {
    h: number;
    s: number;
    v: number;
    a?: number;
};

function hsvToHex(color: HsvColor): string {
    const hue = ((color.h % 360) + 360) % 360;
    const saturation = color.s > 1 ? color.s / 100 : color.s;
    const value = color.v > 1 ? color.v / 100 : color.v;

    const chroma = value * saturation;
    const huePrime = hue / 60;
    const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (huePrime >= 0 && huePrime < 1) {
        r1 = chroma;
        g1 = x;
    } else if (huePrime >= 1 && huePrime < 2) {
        r1 = x;
        g1 = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
        g1 = chroma;
        b1 = x;
    } else if (huePrime >= 3 && huePrime < 4) {
        g1 = x;
        b1 = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
        r1 = x;
        b1 = chroma;
    } else {
        r1 = chroma;
        b1 = x;
    }

    const match = value - chroma;
    const toHex = (channel: number) => {
        const normalized = Math.round((channel + match) * 255);
        return normalized.toString(16).padStart(2, "0");
    };

    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

function App() {
    const paintCanvasRef = useRef<PaintCanvasHandle>(null);
    const [color, setColor] = useState("#000000");
    const [pickerColor, setPickerColor] = useState<HsvColor>({ h: 0, s: 0, v: 0 });
    const [lineWidth, setLineWidth] = useState(4);
    const [sidePanelOpen, setSidePanelOpen] = useState(true);
    const [colorPickerDialogOpen, setColorPickerDialogOpen] = useState(false);

    function onClear() {
        paintCanvasRef.current?.clear();
    }

    function toggleSidePanel() {
        setSidePanelOpen(!sidePanelOpen);
    }

    return (
        <FluentProvider theme={webLightTheme}>
            <h1>Paint</h1>
            <Toolbar className="toolbar" aria-label="Paint controls">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ToolbarButton onClick={() => setColorPickerDialogOpen(true)}>Color</ToolbarButton>
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: color,
                            border: "2px solid #333",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <label>
                    Size:
                    <input
                        type="range"
                        min={1}
                        max={40}
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                    />
                    {lineWidth}px
                </label>
                <ToolbarButton onClick={onClear}>Clear</ToolbarButton>
                <ToolbarButton onClick={toggleSidePanel}>{sidePanelOpen ? "Close" : "Open"} Editor</ToolbarButton>
            </Toolbar>
            <Dialog open={colorPickerDialogOpen} onOpenChange={(_, data) => setColorPickerDialogOpen(data.open)}>
                <DialogSurface>
                    <DialogContent>
                        <DialogTitle>Pick a Color</DialogTitle>
                        <div style={{ padding: "20px" }}>
                            <ColorPicker
                                className="colorPicker"
                                color={pickerColor}
                                onColorChange={(_, data) => {
                                    setPickerColor(data.color);
                                    setColor(hsvToHex(data.color));
                                }}
                            >
                                <ColorArea />
                                <ColorSlider />
                            </ColorPicker>
                        </div>
                    </DialogContent>
                </DialogSurface>
            </Dialog>
            <div style={{ display: "flex", gap: "8px" }}>
                <PaintCanvas ref={paintCanvasRef} color={color} lineWidth={lineWidth} />
                <iframe
                    src="/edit.html?site_name=demo"
                    style={{
                        border: "1px solid #ccc",
                        width: "400px",
                        height: "600px",
                        display: sidePanelOpen ? "block" : "none",
                    }}
                    title="Editor"
                />
            </div>
        </FluentProvider>
    );
}

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<App />);
