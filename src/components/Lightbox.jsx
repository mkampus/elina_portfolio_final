// Lightbox.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalState } from '../hooks/useModalState';

const Lightbox = ({ media, currentIndex, setCurrentIndex, project, onClose }) => {
    const { setIsModalOpen } = useModalState();

    const checkIsMobile = () => {
        const isSmallWidth = window.innerWidth < 768;
        const isShortHeight = window.innerHeight < 500;
        return isSmallWidth || isShortHeight;
    };

    const [isMobile, setIsMobile] = useState(checkIsMobile());
    const activeAsset = media[currentIndex];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        onClose();
    }, [setIsModalOpen, onClose]);

    const next = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, [media.length, setCurrentIndex]);

    const prev = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + media.length) % media.length
        );
    }, [media.length, setCurrentIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev, handleClose]);

    if (!activeAsset || !project) return null;

    // Mobile-only fullscreen image view
    if (isMobile) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                    onClick={handleClose}
                >
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-center p-2"
                    >
                        <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {activeAsset.type === 'video' ? (
                                <video
                                    src={activeAsset.src}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={activeAsset.src}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Navigation arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded text-2xl"
                            >
                                ‹
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded text-2xl"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 z-30 font-mono text-sm text-white bg-black/50 px-3 py-2 backdrop-blur-md">
                        {String(currentIndex + 1).padStart(2, '0')} /{' '}
                        {String(media.length).padStart(2, '0')}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-30 text-white text-3xl font-light hover:opacity-70 transition-opacity"
                    >
                        ✕
                    </button>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Desktop view with info panel
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row overflow-hidden"
            >
                {/* Media Area Left Side */}
                <div className="order-1 flex-1 md:flex-[7] bg-gray-50 relative flex items-center justify-center overflow-hidden md:min-h-screen">
                    <div
                        className="absolute inset-0 z-10 cursor-zoom-out"
                        onClick={handleClose}
                    />

                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-20 pointer-events-none flex items-center justify-center w-full h-full p-4 md:p-16"
                    >
                        <div className="pointer-events-auto shadow-2xl bg-black">
                            {activeAsset.type === 'video' ? (
                                <video
                                    src={activeAsset.src}
                                    controls
                                    className="max-w-full max-h-[40vh] md:max-h-[80vh] block"
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={activeAsset.src}
                                    alt=""
                                    className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain block"
                                />
                            )}
                        </div>
                    </motion.div>

                    <div className="absolute inset-y-0 left-0 w-24 z-30 hidden md:flex items-center justify-center">
                        <button
                            onClick={prev}
                            className="opacity-40 hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-3 py-2 text-[8px] font-mono uppercase tracking-widest cursor-w-resize"
                        >
                            Eelm
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-24 z-30 hidden md:flex items-center justify-center">
                        <button
                            onClick={next}
                            className="opacity-40 hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-3 py-2 text-[8px] font-mono uppercase tracking-widest cursor-e-resize"
                        >
                            Järg
                        </button>
                    </div>

                    <div className="absolute bottom-8 left-8 z-30 font-mono text-[9px] text-gray-300 tracking-[0.4em] pointer-events-none">
                        {String(currentIndex + 1).padStart(2, '0')} /{' '}
                        {String(media.length).padStart(2, '0')}
                    </div>
                </div>

                {/* Data Panel Right Side - Desktop only */}
                <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="order-2 flex-1 md:flex-[3] md:h-full p-4 md:p-16 flex flex-col bg-white border-l border-gray-100 z-50 overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto space-y-6 md:space-y-12 no-scrollbar pr-2">
                        <div className="space-y-2 md:space-y-4">
                            <span className="text-[9px] font-mono text-accent-front uppercase tracking-[0.3em]">
                                Arhiiv
                            </span>
                            <h2 className="text-2xl md:text-6xl font-light tracking-tighter uppercase leading-[0.85]">
                                {project.title}
                            </h2>
                            <p className="text-[9px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                {project.year} // {project.medium}
                            </p>
                        </div>

                        {project.role && (
                            <div className="space-y-4 md:space-y-8 pt-4 md:pt-8 border-t border-gray-100">
                                <div>
                                    <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-1 md:mb-2">
                                        Roll
                                    </p>
                                    <p className="text-xs md:text-base uppercase tracking-wider font-medium text-gray-900">
                                        {project.role}
                                    </p>
                                </div>
                            </div>
                        )}

                        {project.description && (
                            <div>
                                <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-1 md:mb-2">
                                    Kirjeldus
                                </p>
                                <p className="text-xs md:text-sm font-light text-gray-700 leading-relaxed line-clamp-3 md:line-clamp-none">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {project.awards && project.awards.length > 0 && (
                            <div>
                                <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-1 md:mb-2">
                                    Auhinnad
                                </p>
                                {project.awards.map((award, idx) => (
                                    <p key={idx} className="text-xs md:text-sm text-gray-700 font-light">
                                        ✦ {award}
                                    </p>
                                ))}
                            </div>
                        )}

                        {(project.externalLink ||
                            project.driveFolder ||
                            project.reviewLink) && (
                            <div>
                                <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-gray-400 mb-1 md:mb-2">
                                    Lingid
                                </p>
                                <div className="space-y-1 md:space-y-2">
                                    {project.externalLink && (
                                        <a
                                            href={project.externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-xs md:text-sm text-gray-900 hover:text-gray-600 font-light underline"
                                        >
                                            Info →
                                        </a>
                                    )}
                                    {project.driveFolder && (
                                        <a
                                            href={project.driveFolder}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-xs md:text-sm text-gray-900 hover:text-gray-600 font-light underline"
                                        >
                                            Drive →
                                        </a>
                                    )}
                                    {project.reviewLink && (
                                        <a
                                            href={project.reviewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-xs md:text-sm text-gray-900 hover:text-gray-600 font-light underline"
                                        >
                                            Arvustus →
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-4 md:pt-8 border-t border-gray-100 text-[8px] md:text-[9px]">
                        <div className="flex gap-4 md:gap-6 font-mono">
                            <button
                                onClick={prev}
                                className="hover:text-accent-front transition-colors"
                            >
                                EELM
                            </button>
                            <button
                                onClick={next}
                                className="hover:text-accent-front transition-colors"
                            >
                                JÄRG
                            </button>
                        </div>
                        <button
                            onClick={handleClose}
                            className="font-mono uppercase tracking-[0.3em] hover:text-accent-front"
                        >
                            Sulge [x]
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Lightbox;