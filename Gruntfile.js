module.exports = function (grunt) {

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*', 'grunt-*', 'assemble']});

    // configurable paths
    var yeomanConfig = {
        src: 'src',
        build: 'build'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            sass: {
                files: ['<%= yeoman.src %>/css/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
            }
//            livereload: {
//                options: {
//
//                },
//                files: [
//                    '<%= yeoman.src %>/templates/{,*/}*.hbs',
//                    '{.tmp,<%= yeoman.src %>}/css/{,*/}*.css',
//                    '{.tmp,<%= yeoman.src %>}/js/{,*/}*.js',
//                    '<%= yeoman.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
//                ],
//                tasks: ['assemble']
//            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost',
                base: './build/'
            }
        },
        
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
//                        '<%= yeoman.build %>/*',
                        '!<%= yeoman.build %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            all: [
                'Gruntfile.js',
                '<%= yeoman.src %>/js/{,*/}*.js'
            ]
        },
        sass: {
            options: {
                style: 'expanded'
            },
            build: {
                files: {
                    '<%= yeoman.build %>/css/styles-pre.css': '<%= yeoman.src %>/css/styles.scss'
                }
            }
        },
        autoprefixer: {
          dist: {
            options: {
              browsers: ['last 2 versions', '> 1%']
            },
            files: {
              '<%= yeoman.build %>/css/styles.css': '<%= yeoman.build %>/css/styles-pre.css'
            }
          }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            jsconcat: {
                // the files to concatenatebower_components/modernizr/modernizr.js
                src: [
                    '<%= yeoman.src %>/js/console.js',
                    '<%= yeoman.src %>/bower_components/jquery/jquery.js',
                    '<%= yeoman.src %>/js/scripts.js'
                ],
                // the location of the resulting JS file
                dest: '<%= yeoman.build %>/js/scripts-all.js'
            },
            cssconcat: {
                // the files to concatenate
                src: [
                    '<%= yeoman.src %>/bower_components/normalize-css/normalize.css',
                    '<%= yeoman.build %>/css/styles.css'
                ],
                // the location of the resulting CSS file
                dest: '<%= yeoman.build %>/css/styles-all.css'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                files: {
                    '<%= yeoman.build %>/js/scripts-all.min.js': ['<%= concat.jsconcat.dest %>']
                }
            }
        },
        assemble: {
            options: {
                flatten: true,
                layout: '<%= yeoman.src %>/templates/layouts/default.hbs',
                partials: '<%= yeoman.src %>/templates/partials/*.hbs'
            },
            pages: {
                files: {
                    '<%= yeoman.src %>/': ['<%= yeoman.src %>/templates/pages/*.md', '!<%= yeoman.src %>/templates/pages/index.md']
                }
            },
            index: {
                files: {
                    '<%= yeoman.src %>/': ['<%= yeoman.src %>/templates/pages/index.md']
                }
            }
        },
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.build %>/img'
                }]
            }
        },
        cssmin: {
            build: {
                files: {
                    '<%= yeoman.build %>/css/styles-all.min.css': ['<%= concat.cssconcat.dest %>']
                }
            }
        },
        htmlmin: {
            build: {
                options: {
                    // removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    // collapseWhitespace: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>',
                    src: '*.html',
                    dest: '<%= yeoman.build %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.src %>',
                    dest: '<%= yeoman.build %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/!(svg-src)/**',
                        'css/fonts/*',
                        'CNAME'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'sass'
            ],
            build: [
                'sass',
                'imagemin',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            }
        },
        buildcontrol: {
            options: {
              dir: 'build',
              commit: true,
              push: true,
              message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
              options: {
                remote: 'git@github.com:tlindgren/tlindgren.github.io.git',
                branch: 'master'
              }
            },
            local: {
              options: {
                remote: '../',
                branch: 'build'
              }
            }
        }    
    });

    grunt.registerTask('html', ['assemble', 'htmlmin','copy']);
    grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('style', ['sass', 'autoprefixer', 'cssmin']);
    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('default', ['js', 'style', 'imagemin', 'clean', 'html']);

};