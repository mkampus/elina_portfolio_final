module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'border-color': 'var(--border-color)',
                'accent-front': 'var(--accent-front)',
                'accent-behind': 'var(--accent-behind)',
            },
            height: {
                '96': '24rem',   // 384px
                '80': '20rem',   // 320px
            }
        },
    },
    plugins: [],
};