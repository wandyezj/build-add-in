import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

type PaintCanvasProps = {
    color: string;
    lineWidth: number;
};

export type PaintCanvasHandle = {
    clear: () => void;
};

const PaintCanvas = forwardRef<PaintCanvasHandle, PaintCanvasProps>(function PaintCanvas({ color, lineWidth }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);

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

    useImperativeHandle(ref, () => ({
        clear() {
            const canvas = canvasRef.current!;
            const context = canvas.getContext("2d")!;
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        },
    }));

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

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        />
    );
});

export default PaintCanvas;
