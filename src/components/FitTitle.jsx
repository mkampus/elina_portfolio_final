// src/components/FitTitle.jsx
import React, { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function FitTitle({
                                     text,
                                     className = "",
                                     maxPx = 30,
                                     minPx = 18,
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
            const available = parent.clientHeight;

            // If parent has no height, default to max.
            if (!available || available < 10) {
                el.style.fontSize = `${maxPx}px`;
                el.style.lineHeight = String(lineHeight);
                return;
            }

            el.style.lineHeight = String(lineHeight);

            // Binary search for the largest font size that fits.
            let low = minPx;
            let high = maxPx;
            let best = minPx;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                el.style.fontSize = `${mid}px`;

                if (el.scrollHeight <= available) {
                    best = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            el.style.fontSize = `${best}px`;
        };

        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(fit);
        };

        const ro = new ResizeObserver(onResize);
        ro.observe(parent);

        fit();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [text, maxPx, minPx, lineHeight]);

    return (
        <h2 ref={elRef} className={className}>
            {text}
        </h2>
    );
}