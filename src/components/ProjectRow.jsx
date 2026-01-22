// src/components/ProjectRow.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectMedia } from "../hooks/useProjectMedia";
import { useModalState } from "../hooks/useModalState";
import FitTitle from "./FitTitle";
import Lightbox from "./Lightbox";

const ProjectRow = ({ project, delay = 0 }) => {
    const { setIsModalOpen } = useModalState();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    const scrollRef = useRef(null);
    const speedRef = useRef(0);
    const requestRef = useRef(null);

    // Tracks whether we've pushed a "modal open" history entry for this session.
    const pushedRef = useRef(false);

    // Tracks whether the mouse is currently over the media strip (for RAF loop).
    const hoveringRef = useRef(false);

    const media = useProjectMedia(project?.mediaFolder);

    const ROW_HEIGHT = "h-[380px]";

    const openLightbox = useCallback(
        (idx) => {
            setActiveIndex(idx);
            setIsModalOpen(true);

            // Push only once per open session (prevents stacking history entries).
            if (!pushedRef.current) {
                window.history.pushState({ modalOpen: true }, "");
                pushedRef.current = true;
            }
        },
        [setIsModalOpen]
    );

    // UI close request: prefer closing via history so Back/Close behave identically.
    // The popstate handler is the single source of truth that actually clears state.
    const requestCloseLightbox = useCallback(() => {
        if (pushedRef.current) {
            window.history.back();
            return;
        }

        // Fallback (e.g., if opened without pushing state for some reason)
        setActiveIndex(null);
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    // Single source of truth: popstate closes the modal state.
    useEffect(() => {
        const handlePopState = () => {
            if (activeIndex !== null) {
                setActiveIndex(null);
                setIsModalOpen(false);
            }
            pushedRef.current = false;
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [activeIndex, setIsModalOpen]);

    // RAF scrolling: run only while hovering (major perf win on long pages).
    const animate = useCallback(() => {
        if (!hoveringRef.current) return;

        if (scrollRef.current && speedRef.current !== 0) {
            scrollRef.current.scrollLeft += speedRef.current;
        }

        requestRef.current = requestAnimationFrame(animate);
    }, []);

    const startAnimate = useCallback(() => {
        if (hoveringRef.current) return;
        hoveringRef.current = true;
        requestRef.current = requestAnimationFrame(animate);
    }, [animate]);

    const stopAnimate = useCallback(() => {
        hoveringRef.current = false;
        speedRef.current = 0;

        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
    }, []);

    useEffect(() => stopAnimate, [stopAnimate]);

    const handleMouseMove = (e) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const percentage = x / width;

        if (percentage < 0.3) {
            speedRef.current = (percentage - 0.3) * 20;
        } else if (percentage > 0.7) {
            speedRef.current = (percentage - 0.7) * 20;
        } else {
            speedRef.current = 0;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="border-b border-gray-100 bg-white w-full"
        >
            <div
                className={`flex flex-col md:flex-row ${ROW_HEIGHT} w-full overflow-hidden relative`}
            >
                {/* MEDIA STRIP */}
                <div
                    className="flex-1 min-w-0 h-full relative group bg-gray-50"
                    onMouseEnter={startAnimate}
                    onMouseLeave={stopAnimate}
                    onMouseMove={handleMouseMove}
                >
                    <div ref={scrollRef} className="flex h-full overflow-x-auto no-scrollbar">
                        {media.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => openLightbox(idx)}
                                type="button"
                                aria-label={`Open media ${idx + 1} for ${project.title}`}
                                className="h-full flex-shrink-0 border-r border-white relative cursor-zoom-in group/item overflow-hidden bg-transparent p-0 border-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-front"
                            >
                                {item.type === "video" ? (
                                    <video
                                        src={item.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        className="h-full w-auto max-w-none object-contain transition-transform duration-700 group-hover/item:scale-[1.03]"
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={`${project.title} media ${idx + 1}`}
                                        className="h-full w-auto max-w-none object-contain transition-transform duration-700 group-hover/item:scale-[1.03]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}

                                <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0 duration-300">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-[0.4em] font-mono text-black">
                    Open_Slide
                  </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* INFO PANEL */}
                <div className="w-full md:w-[420px] min-w-0 flex-shrink-0 flex flex-col min-h-0 p-6 md:p-10 border-l border-gray-100 bg-white z-30">
                    {/* Content */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <div className="flex items-center justify-between mb-4 gap-2">
              <span className="text-[10px] font-mono text-accent-front tracking-tighter uppercase font-semibold flex-shrink-0">
                // {project.year}
              </span>
                            <span className="text-[8px] uppercase tracking-[0.4em] text-gray-300 font-medium flex-shrink-0">
                {project.medium}
              </span>
                        </div>

                        <div className="mb-4 md:mb-6 max-h-[84px] md:max-h-[132px] overflow-hidden">
                            <FitTitle
                                text={project.title}
                                maxPx={30}
                                minPx={20}
                                lineHeight={1.1}
                                className="font-light tracking-tight uppercase break-words"
                            />
                        </div>

                        {project.role && (
                            <div className="space-y-3 pt-3 border-t border-gray-100">
                                <div>
                                    <p className="text-[7px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">
                                        Roll
                                    </p>
                                    <p className="text-[12px] uppercase tracking-wider font-semibold text-gray-900 break-words">
                                        {project.role}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        type="button"
                        className="text-left py-4 text-[8px] uppercase tracking-[0.5em] text-gray-300 hover:text-black transition-colors border-t border-gray-100 mt-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-front"
                    >
                        Lisainfo {isExpanded ? "−" : "+"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-white"
                    >
                        <div className="p-12 space-y-8">
                            {(project.director || project.photographer) && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-3">
                                        {project.director ? "Režissöör" : "Fotograaf"}
                                    </p>
                                    <p className="text-sm font-light text-gray-700">
                                        {project.director || project.photographer}
                                    </p>
                                </div>
                            )}

                            {project.description && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-3">
                                        Kirjeldus
                                    </p>
                                    <p className="text-sm font-light text-gray-700 leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            {project.awards && project.awards.length > 0 && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-3">
                                        Auhinnad
                                    </p>
                                    <div className="space-y-2">
                                        {project.awards.map((award, idx) => (
                                            <p key={idx} className="text-sm text-gray-700 font-light">
                                                ✦ {award}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(project.externalLink || project.driveFolder || project.reviewLink) && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-3">
                                        Lingid
                                    </p>
                                    <div className="space-y-2">
                                        {project.externalLink && (
                                            <a
                                                href={project.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-front"
                                            >
                                                Info →
                                            </a>
                                        )}
                                        {project.driveFolder && (
                                            <a
                                                href={project.driveFolder}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-front"
                                            >
                                                Drive →
                                            </a>
                                        )}
                                        {project.reviewLink && (
                                            <a
                                                href={project.reviewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-front"
                                            >
                                                Arvustus →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Lightbox
                media={media}
                currentIndex={activeIndex}
                setCurrentIndex={setActiveIndex}
                project={project}
                onClose={requestCloseLightbox}
            />
        </motion.div>
    );
};

export default ProjectRow;