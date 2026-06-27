import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
    ColorArea,
    ColorPicker,
    ColorSlider,
    FluentProvider,
    Toolbar,
    ToolbarButton,
    webLightTheme,
} from "@fluentui/react-components";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const [color, setColor] = useState("#000000");
    const [pickerColor, setPickerColor] = useState<HsvColor>({ h: 0, s: 0, v: 0 });
    const [lineWidth, setLineWidth] = useState(4);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, []);

    function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        drawing.current = true;
        canvasRef.current!.setPointerCapture(e.pointerId);
        const context = canvasRef.current!.getContext("2d")!;
        const { x, y } = getPos(e);
        context.beginPath();
        context.moveTo(x, y);
    }

    function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (!drawing.current) {
            return;
        }
        const context = canvasRef.current!.getContext("2d")!;
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        const { x, y } = getPos(e);
        context.lineTo(x, y);
        context.stroke();
    }

    function onPointerUp() {
        drawing.current = false;
    }

    function onClear() {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    return (
        <FluentProvider theme={webLightTheme}>
            <h1>Paint</h1>
            <Toolbar className="toolbar" aria-label="Paint controls">
                <div className="colorPickerControl">
                    <span>Color</span>
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
            </Toolbar>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            />
        </FluentProvider>
    );
}

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<App />);
