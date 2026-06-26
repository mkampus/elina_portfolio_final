import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import infrontData from '../data/infrontData.json';
import Lightbox from '../components/Lightbox';
import SeoHead from '../components/SeoHead';
import VisibleVideo from '../components/VisibleVideo';
import { useProjectMedia } from '../hooks/useProjectMedia';
import {
    findProjectByRoute,
    getCategoryLabelForMedium,
    getProjectMetaDescription,
    getProjectPath,
    getProjectSeoTitle,
} from '../utils/seo';

const ProjectPage = () => {
    const { categorySlug, projectSlug } = useParams();
    const project = useMemo(
        () => findProjectByRoute(categorySlug, projectSlug),
        [categorySlug, projectSlug]
    );
    const media = useProjectMedia(project);
    const [activeIndex, setActiveIndex] = useState(null);

    if (!project) {
        return (
            <main className="min-h-screen bg-white px-6 py-16 md:px-12">
                <SeoHead
                    title={`Project Not Found - ${infrontData.hero?.name || 'Portfolio'}`}
                    description="The requested project page was not found."
                    canonicalPath="/"
                />
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-light uppercase tracking-tight">Project not found</h1>
                    <p className="mt-4 text-sm text-gray-700">
                        This project URL is not available.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-block border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                    >
                        Back to portfolio
                    </Link>
                </div>
            </main>
        );
    }

    const pagePath = getProjectPath(project);
    const pageTitle = getProjectSeoTitle(project);
    const pageDescription = getProjectMetaDescription(project);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: pageDescription,
        dateCreated: project.year ? String(project.year) : undefined,
        genre: project.medium,
        url:
            typeof window !== 'undefined'
                ? `${window.location.origin}${pagePath}`
                : pagePath,
        creator: {
            '@type': 'Person',
            name: infrontData.hero?.name,
        },
        image: media
            .filter((item) => item.type === 'image')
            .map((item) => item.src)
            .slice(0, 5),
    };

    return (
        <main className="min-h-screen bg-white px-6 py-8 md:px-12 md:py-12">
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath={pagePath}
                type="article"
                ogImage={project.ogImage || project.heroImage}
                structuredData={structuredData}
                structuredDataId={`project-${projectSlug}`}
            />

            <article className="mx-auto w-full max-w-[1400px]">
                <header className="border-b border-gray-100 pb-8 md:pb-10">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
                        {getCategoryLabelForMedium(project.medium)}
                    </p>
                    <h1 className="mt-4 text-4xl font-light uppercase tracking-tight md:text-7xl">
                        {project.title}
                    </h1>
                    <p className="mt-4 text-sm text-gray-700 md:text-base">
                        {[project.year, project.medium, project.role].filter(Boolean).join(' • ')}
                    </p>
                    {(project.director || project.photographer) && (
                        <p className="mt-2 text-sm text-gray-700 md:text-base">
                            {project.director ? `Director: ${project.director}` : ''}
                            {project.director && project.photographer ? ' • ' : ''}
                            {project.photographer ? `Photographer: ${project.photographer}` : ''}
                        </p>
                    )}
                    <Link
                        to="/"
                        className="mt-6 inline-block text-xs uppercase tracking-[0.2em] underline underline-offset-4"
                    >
                        Back to homepage
                    </Link>
                </header>

                {project.description && (
                    <section className="border-b border-gray-100 py-8 md:py-10">
                        <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500">Description</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-800 md:text-base">
                            {project.description}
                        </p>
                    </section>
                )}

                {project.awards && project.awards.length > 0 && (
                    <section className="border-b border-gray-100 py-8 md:py-10">
                        <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500">Awards</h2>
                        <ul className="mt-4 space-y-2 text-sm text-gray-800 md:text-base">
                            {project.awards.map((award) => (
                                <li key={award}>{award}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {(project.externalLink || project.reviewLink || project.driveFolder) && (
                    <section className="border-b border-gray-100 py-8 md:py-10">
                        <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500">Links</h2>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
                            {project.externalLink && (
                                <a
                                    href={project.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4"
                                >
                                    Info
                                </a>
                            )}
                            {project.reviewLink && (
                                <a
                                    href={project.reviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4"
                                >
                                    Review
                                </a>
                            )}
                            {project.driveFolder && (
                                <a
                                    href={project.driveFolder}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4"
                                >
                                    Drive
                                </a>
                            )}
                        </div>
                    </section>
                )}

                <section className="py-8 md:py-10">
                    <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500">Gallery</h2>
                    {media.length > 0 ? (
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {media.map((item, index) => (
                                <button
                                    key={`${project.id}-${index}`}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className="group overflow-hidden border border-gray-100 bg-gray-50 text-left"
                                >
                                    {item.type === 'video' ? (
                                        <VisibleVideo
                                            src={item.src}
                                            className="h-[320px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <img
                                            src={item.thumbnailSrc || item.src}
                                            alt={item.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-[320px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    )}
                                    {item.caption && (
                                        <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-600">
                                            {item.caption}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-gray-600">No media added for this project yet.</p>
                    )}
                </section>
            </article>

            <Lightbox
                media={media}
                currentIndex={activeIndex}
                setCurrentIndex={setActiveIndex}
                project={project}
                onClose={() => setActiveIndex(null)}
            />
        </main>
    );
};

export default ProjectPage;
