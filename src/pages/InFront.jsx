// InFront.jsx
import React, { useMemo, useState, useEffect } from 'react';
import infrontData from '../data/infrontData.json';
import ProjectRow from '../components/ProjectRow';
import ProjectRowMobile from '../components/ProjectRowMobile';

const InFront = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Group projects by category
    const groupedProjects = useMemo(() => {
        const groups = {
            'film ja reklaam': [],
            'teater': [],
            'shoots': []
        };

        infrontData.projects.forEach((project) => {
            if (project.medium === 'Film' || project.medium === 'Reklaam') {
                groups['film ja reklaam'].push(project);
            } else if (project.medium === 'Teater') {
                groups['teater'].push(project);
            } else if (project.medium === 'Fotograafia') {
                groups['shoots'].push(project);
            }
        });

        Object.keys(groups).forEach((category) => {
            groups[category].sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;

                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                if (yearB !== yearA) return yearB - yearA;

                const priorityA = a.priority || 0;
                const priorityB = b.priority || 0;
                if (priorityB !== priorityA) return priorityB - priorityA;

                return a.title.localeCompare(b.title);
            });
        });

        return groups;
    }, []);

    const categories = Object.keys(groupedProjects);

    return (
        <div className="min-h-screen bg-white w-full">
            {/* Header */}
            <header className="pt-8 md:pt-24 pb-6 md:pb-12 px-6 md:px-12 border-b border-gray-100 w-full bg-white z-40 sticky top-0">
                <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex-1">
                        <h1 className="text-5xl md:text-[120px] font-light uppercase leading-none md:leading-none mb-1 m-0 p-0">
                            {infrontData.hero.name}
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-light uppercase text-gray-400 tracking-wider m-0 p-0 ml-[11px]">
                            {infrontData.hero.title}
                        </h2>
                    </div>
                </div>
            </header>

            <main className="w-full">
                {isMobile ? (
                    // MOBILE VIEW
                    <div className="px-6 py-2 max-w-[600px] mx-auto">
                        {categories.map((category) => (
                            <div key={category} className="mb-6">
                                {/* Category Header */}
                                <div className="py-3 mb-4 border-b border-gray-100">
                                    <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-gray-700 font-bold">
                                        {category}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {groupedProjects[category].map((project, index) => (
                                        <ProjectRowMobile
                                            key={project.id}
                                            project={project}
                                            delay={index * 0.05}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // DESKTOP VIEW
                    <>
                        {categories.map((category, categoryIndex) => (
                            <div key={category} className="mb-12 md:mb-20">
                                {/* Category Header with Line Anchor */}
                                <div className="flex items-center gap-4 px-8 md:px-12 pt-12 md:pt-16 pb-6 md:pb-8">
                                    <h2 className="font-mono font-semibold text-base uppercase tracking-[0.3em] text-gray-700">
                                        {category}
                                    </h2>
                                    <div className="flex-grow h-[1px] bg-gray-100"></div>
                                </div>

                                <div>
                                    {groupedProjects[category].map((project, index) => (
                                        <ProjectRow
                                            key={project.id}
                                            project={project}
                                            delay={index * 0.05}
                                        />
                                    ))}
                                </div>

                                {categoryIndex < categories.length - 1 && (
                                    <div className="h-8 md:h-12"></div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="py-24 md:py-48 px-6 md:px-12 border-t border-gray-100 flex flex-col items-center">
                <a
                    href={`mailto:${infrontData.contact.email}`}
                    className="text-3xl md:text-7xl hover:text-accent-front transition-all underline underline-offset-[12px] md:underline-offset-[24px] font-light tracking-tighter uppercase decoration-[1px] break-all"
                >
                    Võta ühendust
                </a>
            </footer>
        </div>
    );
};

export default InFront;