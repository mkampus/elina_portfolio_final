import infrontData from '../data/infrontData.json';

export const CATEGORY_GROUPS = [
    {
        slug: 'film-ja-reklaam',
        label: 'film ja reklaam',
        mediums: ['Film', 'Reklaam'],
    },
    {
        slug: 'teater',
        label: 'teater',
        mediums: ['Teater'],
    },
    {
        slug: 'shoots',
        label: 'shoots',
        mediums: ['Shoot'],
    },
];

const FALLBACK_CATEGORY = CATEGORY_GROUPS[0];

export const slugify = (value = '') =>
    String(value)
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

export const getProjectSlug = (project = {}) =>
    project.slug || project.id || slugify(project.title) || 'project';

export const getCategoryForMedium = (medium) =>
    CATEGORY_GROUPS.find((group) => group.mediums.includes(medium)) || FALLBACK_CATEGORY;

export const getCategorySlugForMedium = (medium) => getCategoryForMedium(medium).slug;

export const getCategoryLabelForMedium = (medium) => getCategoryForMedium(medium).label;

export const getProjectPath = (project) =>
    `/${getCategorySlugForMedium(project?.medium)}/${getProjectSlug(project)}`;

export const sortProjects = (a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;
    if (yearB !== yearA) return yearB - yearA;

    const priorityA = Number(a.priority) || 0;
    const priorityB = Number(b.priority) || 0;
    if (priorityB !== priorityA) return priorityB - priorityA;

    return (a.title || '').localeCompare(b.title || '');
};

export const getGroupedProjects = (projects = infrontData.projects || []) =>
    CATEGORY_GROUPS.map((group) => ({
        ...group,
        projects: projects
            .filter((project) => group.mediums.includes(project.medium))
            .sort(sortProjects),
    })).filter((group) => group.projects.length > 0);

export const findProjectByRoute = (categorySlug, projectSlug) => {
    const projects = infrontData.projects || [];
    return projects.find((project) => {
        const projectCategorySlug = getCategorySlugForMedium(project.medium);
        const slug = getProjectSlug(project);
        return projectCategorySlug === categorySlug && slug === projectSlug;
    });
};

export const getProjectSeoTitle = (project) => {
    if (!project) return infrontData.hero?.name || 'Portfolio';
    return (
        project.seoTitle ||
        `${project.title || 'Project'} - ${infrontData.hero?.name || 'Portfolio'}`
    );
};

export const getProjectMetaDescription = (project) => {
    if (!project) return '';
    if (project.metaDescription) return project.metaDescription;

    const details = [project.year, project.medium, project.role].filter(Boolean).join(' • ');
    if (project.description) {
        return `${details ? `${details}. ` : ''}${project.description}`.slice(0, 160);
    }
    return details || `${project.title || 'Project'} on ${infrontData.hero?.name || 'portfolio'}`;
};
