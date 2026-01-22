// ProjectRowMobile.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjectMedia } from '../hooks/useProjectMedia';
import { useModalState } from '../hooks/useModalState';
import Lightbox from './Lightbox';

const ProjectRowMobile = ({ project, delay = 0 }) => {
    const { setIsModalOpen } = useModalState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const media = useProjectMedia(project?.mediaFolder);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const currentMedia = media[currentIndex];

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % media.length);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + media.length) % media.length);
    };

    const handleOpenLightbox = (idx) => {
        setActiveIndex(idx);
        setIsModalOpen(true);
        window.history.pushState({ modalOpen: true }, null);
    };

    const handleCloseLightbox = useCallback(() => {
        setActiveIndex(null);
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    useEffect(() => {
        const handlePopState = () => {
            if (activeIndex !== null) {
                window.history.pushState({ modalOpen: true }, null);
                handleCloseLightbox();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeIndex, handleCloseLightbox]);

    const handleTouchStart = (e) => {
        if (e.target.closest('video')) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current || !touchStartY.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchStartX.current - touchEndX;
        const diffY = Math.abs(touchStartY.current - touchEndY);

        // Swipe threshold: 50px horizontal, dominant axis
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY * 1.5) {
            if (diffX > 0) handleNext();
            else handlePrev();
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="border-b border-gray-100 pb-2 w-full"
        >
            {/* MEDIA CAROUSEL */}
            {media.length > 0 ? (
                <div
                    className="mb-2 relative touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="w-full h-56 overflow-hidden flex items-center justify-center bg-white cursor-zoom-in"
                        onClick={() => handleOpenLightbox(currentIndex)}
                    >
                        {currentMedia?.type === 'video' ? (
                            <video
                                src={currentMedia.src}
                                className="w-full h-full object-contain"
                                controls
                                playsInline
                                muted
                            />
                        ) : (
                            <img
                                src={currentMedia.src}
                                alt={project.title}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Navigation Click Zones */}
                    {media.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded transition-all text-lg"
                                aria-label="Previous"
                            >
                                ‹
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded transition-all text-lg"
                                aria-label="Next"
                            >
                                ›
                            </button>

                            {/* Counter */}
                            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white bg-black/50 px-1.5 py-0.5 backdrop-blur-md">
                                {String(currentIndex + 1).padStart(2, '0')} /{' '}
                                {String(media.length).padStart(2, '0')}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="w-full h-56 bg-white mb-2 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Meedia puudub
                    </span>
                </div>
            )}

            {/* INFO SECTION */}
            <div className="px-0 space-y-1.5">
                <div className="flex justify-between items-baseline gap-2">
                    <h2 className="text-base font-light tracking-tight leading-none uppercase">
                        {project.title}
                    </h2>
                    <span className="text-[8px] font-mono text-accent-front shrink-0">
                        {project.year}
                    </span>
                </div>

                <div className="flex flex-col gap-0.5 border-l border-accent-front/30 pl-2">
                    {project.role && (
                        <p className="text-[8px] uppercase tracking-[0.1em] font-semibold text-gray-900">
                            {project.role}
                        </p>
                    )}
                    <div className="flex gap-1 text-[8px] uppercase tracking-widest text-gray-500">
                        <span>{project.medium}</span>
                        {project.director && (
                            <>
                                <span>/</span>
                                <span>{project.director}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Description & Awards & Links */}
                {(project.description ||
                    (project.awards && project.awards.length > 0) ||
                    project.externalLink ||
                    project.reviewLink) && (
                    <div className="pt-0.5">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[7px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                        >
                            {isExpanded ? 'Peida −' : 'Loe +'}
                        </button>

                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-1 space-y-1.5"
                            >
                                {project.description && (
                                    <p className="text-[7px] text-gray-600 font-light leading-tight">
                                        {project.description}
                                    </p>
                                )}

                                {project.awards &&
                                    project.awards.length > 0 && (
                                        <div>
                                            <p className="text-[7px] uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                                                Auhinnad
                                            </p>
                                            {project.awards.map(
                                                (award, idx) => (
                                                    <p
                                                        key={idx}
                                                        className="text-[7px] text-gray-600"
                                                    >
                                                        ★ {award}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}

                                {/* Links */}
                                {(project.externalLink ||
                                    project.reviewLink) && (
                                    <div className="flex flex-wrap gap-2 pt-0.5 border-t border-gray-200">
                                        {project.externalLink && (
                                            <a
                                                href={project.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[7px] border-b border-gray-300 hover:border-black pb-0 transition-colors"
                                            >
                                                Info →
                                            </a>
                                        )}
                                        {project.reviewLink && (
                                            <a
                                                href={project.reviewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[7px] border-b border-gray-300 hover:border-black pb-0 transition-colors"
                                            >
                                                Arvustus →
                                            </a>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* LIGHTBOX MODAL */}
            <Lightbox
                media={media}
                currentIndex={activeIndex}
                setCurrentIndex={setActiveIndex}
                project={project}
                onClose={() => handleCloseLightbox()}
            />
        </motion.div>
    );
};

export default ProjectRowMobile;