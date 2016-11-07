module.exports = function(gulp, options, plugins) {

    gulp.task('clean', function() {
        return gulp.src('public/*')
            .pipe(plugins.clean());
    });

    // Copy all other files to dist directly
    gulp.task('copy', function() {
        // Copy html
        gulp.src(['*.html'], { cwd: './' })
            .pipe(gulp.dest('public/'));

        // Copy fonts
        gulp.src(['less/themes/rightfit/assets/*/**'], { cwd: './' })
            .pipe(gulp.dest('public/assets'));

        // Copy images
        gulp.src(['images/**'], { cwd: './' })
            .pipe(gulp.dest('public/assets/images'));

    });

    gulp.task('clean-copy', function(done) {
        options.sequence('clean', 'copy', function() {
            done();
        });
    });


};