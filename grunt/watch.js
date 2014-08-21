module.exports = {
    options: {
        livereload: true,
        debounce: 250
    },
    all: {
        files: ['static/js/**/*.js', 'static/tests/specs/**/*.js', 'static/styles/less/*.less'],
        tasks: ['build']
    }
};
