import { useMemo } from 'react';

export const useProjectMedia = (mediaFolder) => {
    return useMemo(() => {
        if (!mediaFolder) return [];

        try {
            const context = require.context(
                '../assets/projects/',
                true,
                /\.(jpg|jpeg|png|gif|mp4|webm|mov)$/i
            );

            const allFiles = context.keys();
            const folderFiles = allFiles.filter(
                (file) => file.includes(`/${mediaFolder}/`)
            );

            return folderFiles
                .sort()
                .map((file) => ({
                    src: context(file),
                    type: /\.(mp4|webm|mov)$/i.test(file) ? 'video' : 'image',
                }));
        } catch (error) {
            console.warn(`Media folder not found: ${mediaFolder}`);
            return [];
        }
    }, [mediaFolder]);
};