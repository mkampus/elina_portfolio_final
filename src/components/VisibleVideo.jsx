import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const VisibleVideo = ({
    src,
    className,
    controls = false,
    loop = true,
    muted = true,
    playsInline = true,
    preload = 'none',
}) => {
    const videoRef = useRef(null);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.25,
    });
    const [shouldLoad, setShouldLoad] = useState(false);

    const setRefs = useCallback(
        (node) => {
            videoRef.current = node;
            inViewRef(node);
        },
        [inViewRef]
    );

    useEffect(() => {
        if (inView) setShouldLoad(true);
    }, [inView]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoad) return;

        if (inView) {
            const playPromise = video.play();
            if (playPromise?.catch) playPromise.catch(() => {});
        } else {
            video.pause();
        }
    }, [inView, shouldLoad]);

    return (
        <video
            ref={setRefs}
            src={shouldLoad ? src : undefined}
            className={className}
            controls={controls}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload={preload}
            autoPlay={inView}
        />
    );
};

export default VisibleVideo;
