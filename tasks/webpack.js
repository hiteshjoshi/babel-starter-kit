import webpack from 'webpack-stream';
import webpackConfig from './../webpack.config.babel';

module.exports = function(gulp, options, plugins) {

    //for Mithriljs views
    gulp.task('transform-jsx', function() {
        return gulp.src('client/src/**/*.jsx')

        .pipe(plugins.msx({ harmony: false }))

        .pipe(gulp.dest('client/modules/'))
    })

    gulp.task('jsx', function(done) {
        options.sequence('transform-jsx', 'webpack', function() {
            //console.log('Run something else');
            done();
        });
    });


    gulp.task('webpack', function() {
        return gulp.src(['client/src/*.js'])
            .pipe(plugins.clean())
            .pipe(plugins.babel({
                presets: ['es2015']
            }))
            .pipe(webpack(webpackConfig))
            //.pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('public'))
            //.pipe(notify({ message: 'webpack task complete' }))
            .pipe(plugins.livereload())
    })


    gulp.task('pack-plugins', function() {
        return gulp.src(['client/plugins/jquery.slim.min.js', 'client/plugins/*'])
            .pipe(plugins.concat('plugins.min.js'))
            .pipe(gulp.dest('public/'))
            .pipe(plugins.notify({ message: 'Pack plugins task complete' }))
            .pipe(plugins.livereload())
    })

};