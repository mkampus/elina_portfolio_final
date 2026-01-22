// ProjectRow.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectMedia } from '../hooks/useProjectMedia';
import { useModalState } from '../hooks/useModalState';
import Lightbox from './Lightbox';

const ProjectRow = ({ project, delay = 0 }) => {
    const { setIsModalOpen } = useModalState();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    const scrollRef = useRef(null);
    const speedRef = useRef(0);
    const requestRef = useRef(null);
    const media = useProjectMedia(project?.mediaFolder);

    const ROW_HEIGHT = "h-[380px]";

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

    const animate = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += speedRef.current;
        }
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

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
            <div className={`flex flex-col md:flex-row ${ROW_HEIGHT} w-full overflow-hidden relative`}>

                {/* MEDIA STRIP */}
                <div
                    className="flex-1 min-w-0 h-full relative group bg-gray-50"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => {
                        speedRef.current = 0;
                    }}
                >
                    <div
                        ref={scrollRef}
                        className="flex h-full overflow-x-auto no-scrollbar"
                    >
                        {media.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleOpenLightbox(idx)}
                                className="h-full flex-shrink-0 border-r border-white relative cursor-zoom-in group/item overflow-hidden"
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-full w-auto max-w-none object-contain transition-transform duration-700 group-hover/item:scale-[1.03]"
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt=""
                                        className="h-full w-auto max-w-none object-contain transition-transform duration-700 group-hover/item:scale-[1.03]"
                                    />
                                )}

                                <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0 duration-300">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-[0.4em] font-mono text-black">
                                        Open_Slide
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INFO PANEL */}
                <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col p-8 md:p-12 border-l border-gray-100 bg-white z-30 overflow-hidden">
                    <div className="flex-1 min-h-0">
                        <div className="flex items-center justify-between mb-8 gap-2">
                            <span className="text-[10px] font-mono text-accent-front tracking-tighter uppercase font-semibold flex-shrink-0">
                                // {project.year}
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.4em] text-gray-300 font-medium flex-shrink-0">
                                {project.medium}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-[1.1] mb-8 uppercase break-words overflow-visible">
                            {project.title}
                        </h2>

                        {project.role && (
                            <div className="space-y-6 pt-8 border-t border-gray-100">
                                <div>
                                    <p className="text-[7px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">
                                        Roll
                                    </p>
                                    <p className="text-[12px] uppercase tracking-wider font-semibold text-gray-900 break-words overflow-visible">
                                        {project.role}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-left py-4 text-[8px] uppercase tracking-[0.5em] text-gray-300 hover:text-black transition-colors border-t border-gray-100 flex-shrink-0 mt-auto"
                    >
                        Lisainfo {isExpanded ? '−' : '+'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-white overflow-visible"
                    >
                        <div className="p-12 space-y-8">
                            {/* Director/Photographer */}
                            {(project.director || project.photographer) && (
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-3">
                                        {project.director ? 'Režissöör' : 'Fotograaf'}
                                    </p>
                                    <p className="text-sm font-light text-gray-700">
                                        {project.director || project.photographer}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
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

                            {/* Awards */}
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

                            {/* Links */}
                            {(project.externalLink ||
                                project.driveFolder ||
                                project.reviewLink) && (
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
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline"
                                            >
                                                Info →
                                            </a>
                                        )}
                                        {project.driveFolder && (
                                            <a
                                                href={project.driveFolder}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline"
                                            >
                                                Drive →
                                            </a>
                                        )}
                                        {project.reviewLink && (
                                            <a
                                                href={project.reviewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-sm text-gray-900 hover:text-gray-600 font-light underline"
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

export default ProjectRow;