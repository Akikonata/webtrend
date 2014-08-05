module.exports = function (grunt) {

    var fs = require('fs');


    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd HH:MM") %> */\n'
            },
            buildLibs: {
                src: [
                    "js/detect.js",
                    "js/libs/jquery-1.10.1.min.js",
                    "js/libs/idangerous.swiper.js",
                    "js/libs/hammer.min.js",
                    "js/libs/jquery.hammer.js",
                    "js/libs/kity.min.js",
                    "js/libs/kitychart.all.js",
                    "js/charts/utils.js",
                    "js/charts/charts.js",
                    "js/charts/area.js",
                    "js/charts/column.js",
                    "js/charts/donut.js",
                    "js/charts/pie.js",
                    "js/charts/p-donut.js",
                    "js/charts/bubble.js",
                    "js/charts/round.js",
                    "index.js",
                    "js/preload.js"
                ],
                dest: 'dist/script.js'
            },
            // buildApp: {
            //     src: [
            //         "public/modules/wc/js/data.js"
            //     ],
            //     dest: 'dist/fy-app.js'
            // }
        },

        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd HH:MM") %> */'
            },
            compress: {
                files: {
                    "dist/style.css" : [
                        "css/idangerous.swiper.css",
                        "css/font.css",
                        "css/charts.css",
                        "css/styles.css"
                    ]
                }
            }
        },

        replace: {
            online: {
                src: 'dist.html',
                overwrite: true,
                replacements: [{
                    from: /<!-- script start -->[^]*<!-- script end -->/ig,
                    to: (function(){
                        return '<script src="dist/script.js?t='+(+new Date)+'"></script>'
                    })()
                }, {
                    from: /<!-- style start -->[^]*<!-- style end -->/ig,
                    to: (function(){
                        return ' <link rel="stylesheet" href="dist/style.css?t='+(+new Date)+'">';
                    })
                }]
            }
        }

    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-text-replace');

    // 默认任务
    grunt.registerTask('default', ['uglify', 'cssmin', 'replace']);

};
