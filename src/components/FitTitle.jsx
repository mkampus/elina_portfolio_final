// src/components/FitTitle.jsx
import React, { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function FitTitle({
                                     text,
                                     className = "",
                                     maxPx = 30,
                                     minPx = 18,
                                     step = 1,
                                     lineHeight = 1.1,
                                 }) {
    const elRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const parent = el.parentElement;
        if (!parent) return;

        let raf = 0;

        const fit = () => {
            // Start big
            let px = maxPx;
            el.style.fontSize = `${px}px`;
            el.style.lineHeight = String(lineHeight);

            const available = parent.clientHeight;

            // If parent has no height, don't shrink
            if (!available || available < 10) return;

            // Shrink until it fits the parent
            while (px > minPx && el.scrollHeight > available) {
                px -= step;
                el.style.fontSize = `${px}px`;
            }
        };

        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(fit);
        };

        const ro = new ResizeObserver(onResize);
        ro.observe(parent);

        window.addEventListener("resize", onResize);
        fit();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [text, maxPx, minPx, step, lineHeight]);

    return (
        <h2 ref={elRef} className={className}>
            {text}
        </h2>
    );
}