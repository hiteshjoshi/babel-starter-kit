require('dotenv').config()
import gulp from 'gulp';
import minimist from 'minimist';
import gulpTasks from 'load-gulp-tasks';
import runSequence from 'run-sequence';
import pkg from './package.json';

const options = {
    pattern: ['tasks/**/*.js', '!tasks/**/dev-*.js'],
    argv: minimist(process.argv),
    sequence: runSequence,
    pkg: pkg
}

gulpTasks(gulp, options)


gulp.task('default', ['clean-copy', 'styles', 'pack-plugins', 'jsx'])

var server = ['default', 'serve', 'watch']

gulp.task('server', server);