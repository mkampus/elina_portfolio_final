import { useMemo } from 'react';

export const useProjectMedia = (projectOrFolder) => {
    const mediaFolder =
        typeof projectOrFolder === 'string'
            ? projectOrFolder
            : projectOrFolder?.mediaFolder;

    return useMemo(() => {
        if (!mediaFolder) return [];

        try {
            const context = require.context(
                '../assets/projects/',
                true,
                /\.(jpg|jpeg|png|gif|mp4|webm|mov)$/i
            );
            const thumbnailContext = require.context(
                '../assets/project-thumbnails/',
                true,
                /\.(jpg|jpeg)$/i
            );

            const allFiles = context.keys();
            const folderFiles = allFiles.filter(
                (file) => file.includes(`/${mediaFolder}/`)
            );

            return folderFiles
                .sort()
                .map((file) => {
                    const type = /\.(mp4|webm|mov)$/i.test(file)
                        ? 'video'
                        : 'image';
                    let thumbnailSrc;

                    if (type === 'image') {
                        try {
                            thumbnailSrc = thumbnailContext(`${file}.jpg`);
                        } catch (error) {
                            thumbnailSrc = context(file);
                        }
                    }

                    return {
                        src: context(file),
                        thumbnailSrc,
                        type,
                    };
                });
        } catch (error) {
            console.warn(`Media folder not found: ${mediaFolder}`);
            return [];
        }
    }, [mediaFolder]);
};
