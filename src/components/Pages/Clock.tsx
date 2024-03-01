import React, { useEffect, useState } from "react";

export function Clock() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    });

    const ticks = Date.now().toString();
    return (
        <div>
            <h2>{ticks}</h2>
        </div>
    );
}
