module.exports = {
    beforeconcat: ['Gruntfile.js', 'express/**/*.js', 'static/js/**/*.js', '!static/js/libraries/**/*.js'],
    afterconcat: ['static/dist/js/app.js'],
    tests: ['tests/**/*.js']
};
