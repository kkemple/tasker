module.exports = {
    build: {
        name: 'Tasker',
        description: 'A time tracking app with JIRA support and verbal and desktop notifications.',
        version: '0.0.1',
        options: {
            paths: ['static/js'],
            outdir: 'static/docs',
            themedir: 'yuidoc-theme',
            helpers: ['yuidoc-theme/helpers/helpers.js']
        }
    }
}