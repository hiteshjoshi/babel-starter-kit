module.exports = function(gulp, options, plugins) {

    gulp.task('watch', function() {
        gulp.watch(['client/plugins/**/*.js'], ['pack-plugins'])
        gulp.watch(['client/*.js', 'client/src/**/*.js', 'plugins/*.js'], ['webpack'])
        gulp.watch(['client/src/**/*.jsx'], ['jsx'])
        gulp.watch(['less/*.less', 'less/**/*.less', 'less/**/**/*.less', 'less/**/**/*.variables', 'less/**/**/*.overrides'], ['styles'])
        plugins.livereload.listen();
    });

};