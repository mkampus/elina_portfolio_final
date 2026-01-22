// ProjectRowMobile.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProjectMedia } from '../hooks/useProjectMedia';

const ProjectRowMobile = ({ project, delay = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
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
            className="border-b border-gray-100 pb-12 w-full"
        >
            {/* MEDIA CAROUSEL */}
            {media.length > 0 ? (
                <div
                    className="mb-6 bg-gray-50 relative touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Aspect ratio 4/3 better fits portrait/vertical images on mobile */}
                    <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100">
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
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Navigation Click Zones */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-0 bottom-0 w-[15%] z-10"
                                aria-label="Previous"
                            />
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-0 bottom-0 w-[15%] z-10"
                                aria-label="Next"
                            />

                            {/* Counter */}
                            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white bg-black/50 px-2 py-1 backdrop-blur-md">
                                {String(currentIndex + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="w-full aspect-[4/3] bg-gray-50 mb-6 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Meedia puudub
                    </span>
                </div>
            )}

            {/* INFO SECTION */}
            <div className="px-1 space-y-5">
                <div className="flex justify-between items-baseline">
                    <h2 className="text-2xl font-light tracking-tight leading-none uppercase">
                        {project.title}
                    </h2>
                    <span className="text-[10px] font-mono text-accent-front shrink-0 ml-4">
                        {project.year}
                    </span>
                </div>

                <div className="flex flex-col gap-1 border-l border-accent-front/30 pl-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-900">
                        {project.role}
                    </p>
                    <div className="flex gap-2 text-[10px] uppercase tracking-widest text-gray-500">
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
                {(project.description || (project.awards && project.awards.length > 0) || project.externalLink || project.reviewLink) && (
                    <div className="pt-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                        >
                            {isExpanded ? 'Peida info −' : 'Loe lisaks +'}
                        </button>

                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-4 space-y-4"
                            >
                                {project.description && (
                                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                                        {project.description}
                                    </p>
                                )}

                                {project.awards && project.awards.length > 0 && (
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                                            Auhinnad
                                        </p>
                                        {project.awards.map((award, idx) => (
                                            <p key={idx} className="text-sm text-gray-600 italic">
                                                ★ {award}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Links - Inside expandable section */}
                                {(project.externalLink || project.reviewLink) && (
                                    <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200">
                                        {project.externalLink && (
                                            <a
                                                href={project.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm border-b border-gray-300 hover:border-black pb-0.5 transition-colors"
                                            >
                                                Info →
                                            </a>
                                        )}
                                        {project.reviewLink && (
                                            <a
                                                href={project.reviewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm border-b border-gray-300 hover:border-black pb-0.5 transition-colors"
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
        </motion.div>
    );
};

export default ProjectRowMobile;