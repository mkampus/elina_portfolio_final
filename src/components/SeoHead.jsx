import { useEffect } from 'react';

const MANAGED_ATTR = 'data-portfolio-seo';

const upsertMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            element.setAttribute(key, value);
        }
    });
    element.setAttribute(MANAGED_ATTR, 'true');
};

const upsertCanonical = (href) => {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    link.setAttribute(MANAGED_ATTR, 'true');
};

const buildCanonicalUrl = (canonicalPath = '/') => {
    if (typeof window === 'undefined') return canonicalPath;
    if (canonicalPath.startsWith('http://') || canonicalPath.startsWith('https://')) {
        return canonicalPath;
    }
    return `${window.location.origin}${canonicalPath}`;
};

export default function SeoHead({
    title,
    description,
    canonicalPath = '/',
    ogImage,
    type = 'website',
    structuredData,
    structuredDataId = 'default',
}) {
    useEffect(() => {
        const canonicalUrl = buildCanonicalUrl(canonicalPath);

        if (title) {
            document.title = title;
        }

        if (description) {
            upsertMeta('meta[name="description"]', {
                name: 'description',
                content: description,
            });
        }

        upsertCanonical(canonicalUrl);

        upsertMeta('meta[property="og:type"]', {
            property: 'og:type',
            content: type,
        });
        if (title) {
            upsertMeta('meta[property="og:title"]', {
                property: 'og:title',
                content: title,
            });
        }
        if (description) {
            upsertMeta('meta[property="og:description"]', {
                property: 'og:description',
                content: description,
            });
        }
        upsertMeta('meta[property="og:url"]', {
            property: 'og:url',
            content: canonicalUrl,
        });
        if (ogImage) {
            upsertMeta('meta[property="og:image"]', {
                property: 'og:image',
                content: ogImage,
            });
        }

        if (title) {
            upsertMeta('meta[name="twitter:title"]', {
                name: 'twitter:title',
                content: title,
            });
        }
        if (description) {
            upsertMeta('meta[name="twitter:description"]', {
                name: 'twitter:description',
                content: description,
            });
        }
        if (ogImage) {
            upsertMeta('meta[name="twitter:image"]', {
                name: 'twitter:image',
                content: ogImage,
            });
        }
        upsertMeta('meta[name="twitter:card"]', {
            name: 'twitter:card',
            content: 'summary_large_image',
        });

        if (structuredData) {
            const scriptId = `portfolio-ld-${structuredDataId}`;
            let script = document.getElementById(scriptId);
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                script.id = scriptId;
                script.setAttribute(MANAGED_ATTR, 'true');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }
    }, [
        canonicalPath,
        description,
        ogImage,
        structuredData,
        structuredDataId,
        title,
        type,
    ]);

    return null;
}
