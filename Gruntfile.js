module.exports = function (grunt) {
    var packageConfig = grunt.file.readJSON('package.json');

    grunt.registerTask('buildJS', 'Minifies and concats JS files if not in development mode', function() {
        var minify = packageConfig.development_mode;

        if (minify) {
            grunt.task.run(['dev']);
        } else {
            grunt.task.run(['prod']);
        }
    });

    grunt.registerMultiTask('writeDevJsFiles', function() {

        var allScriptTags = [];

        this.files.forEach(function(file) {

            // expand each file glob and filter to files, then return mapped script tags
            var scriptTags = file.src.filter(function(filepath) {

                // remove nonexistent files, warn of the incorrect paths
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else if (grunt.file.isDir(filepath)) { // make sure it's not a dir
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                return '<script src="dist/' + filepath.replace('static/', '') + '"></script>';
            });

            allScriptTags = allScriptTags.concat(scriptTags);
        });

        // read the file
        var contents = grunt.file.read('express/views/index.ejs.template');

        // replace the user path
        contents = contents.replace('{{jsFiles}}', allScriptTags.join('\n'));

        grunt.file.write('express/views/index.ejs', contents);
    });

    grunt.registerTask('writeProdJsFiles', function() {
        // read the file
        var contents = grunt.file.read('express/views/index.ejs.template');

        // replace the user path
        contents = contents.replace('{{jsFiles}}', '<script src="dist/js/app.js"></script>');

        grunt.file.write('express/views/index.ejs', contents);
    });

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // init grunt config
    require('load-grunt-config')(grunt);
};
