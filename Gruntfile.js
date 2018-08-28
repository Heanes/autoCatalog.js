module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('build/plugin.info.json'),
        banner: '/*\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM:ss dddd") %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage : "" %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * Licensed <%= grunt.util._.get(pkg.licenses, "type") %>\n' +
                ' */\n',
        // Task configuration.
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.js': 'src/js/<%= pkg.name %>.js'
                }
            }
        },
        clean: ['dist', 'doc/static/vendor/<%= pkg.name %>/<%= pkg.version %>'],
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>',
            },
            dist: {
                src:  ['src/js/<%= pkg.name %>.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            /*options: {
                stripBanners: true,
                banner: '/!*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                              '<%= grunt.template.today("yyyy-mm-dd") %> *!/',
            },
            dist: {
                src: ['src/project.js'],
                dest: 'dist/built.js',
            }*/
            /*locale_target: {
                src: ['src/locale/!**!/!*.js'],
                dest: 'dist/<%= pkg.name %>-locale-all.js'
            }*/
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                sourceMap: true,
                sourceMapName: 'dist/js/<%= pkg.name %>.js.map'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['dist/js/<%=pkg.name %>.js'],
                    //'dist/<%= pkg.name %>-all.min.js': ['dist/<%=pkg.name %>-all.js'],
                    //'dist/js/<%= pkg.name %>-locale-all.min.js': ['dist/js/<%=pkg.name %>-locale-all.js']
                }
            },
            /*locale_target: {
                files: [{
                    expand: true,
                    cwd: 'src/locale',
                    src: '**!/!*.js',
                    dest: 'dist/locale',
                    ext: '.min.js' // replace .js to .min.js
                }]
            },
            extensions_target: {
                files: [{
                    expand: true,
                    cwd: 'src/extensions',
                    src: '**!/!*.js',
                    dest: 'dist/extensions',
                    ext: '.min.js' // replace .js to .min.js
                }]
            }*/
        },
        cssmin: {
            dist: {
                options: {
                    banner: '<%= banner %>',
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
                },
                files: {
                    'dist/css/<%= pkg.name %>.min.css': ['src/css/<%=pkg.name %>.css']
                }
            }
        },
        copy: {
            dist: {
                cwd: 'src',                     // set working folder / root to copy
                src: ['**/*.js', '**/*.css'],   // copy all files and subfolders
                dest: 'dist',                   // destination folder
                expand: true                    // required when using cwd
            },
            // 复制到doc的static中去
            docDist: {
                cwd: 'dist',                                // set working folder / root to copy
                src: '**/*',                                // copy all files and subfolders
                dest: 'doc/static/vendor/js/<%= pkg.name %>/<%= pkg.version %>',  // destination folder
                expand: true                                // required when using cwd
            }
        },
        release: {
            options: {
                additionalFiles: ['build/pluginName.info.json'],
                beforeRelease: ['doc', 'default']
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-release');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'concat', 'cssmin', 'babel','uglify','copy']);

};