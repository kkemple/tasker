module.exports = {
    dist: {
        expand: true,
        cwd: 'static/',
        src: [
            'js/App/bootstrapper.js',
            'js/Data/**/*.js',
            'js/Components/**/*.js',
            'js/Widgets/**/*.js',
            'js/Screens/**/*.js',
            'js/App/init.js'
        ],
        dest: 'static/dist/'
    }
};