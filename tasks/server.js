import ecstatic from 'ecstatic';
import http from 'http';

module.exports = function(gulp, options, plugins) {



    // Launch a lightweight HTTP Server
    gulp.task('run', function(next) {
        var url = require('url'),
            fileServer = ecstatic({ root: './public', cache: 'no-cache', showDir: false }),
            port = 8888;
        http.createServer()
            .on('request', function(req, res) {
                // For non-existent files output the contents of /index.html page in order to make HTML5 routing work

                var urlPath = url.parse(req.url).pathname;
                if (urlPath === '/') {
                    req.url = '/index.html';
                } else if (
                    ['css', 'html', 'ico', 'woff2', 'woff', 'ttf', 'less', 'js.map', 'js', 'jpg', 'png', 'gif', 'txt', 'xml', 'svg'].indexOf(urlPath.split('.').pop()) == -1 && ['bower_components', 'fonts', 'images', 'src', 'vendor', 'views'].indexOf(urlPath.split('/')[1]) == -1) {
                    req.url = '/index.html';
                } else if (['src', 'bower_components'].indexOf(urlPath.split('/')[1]) == -1) {
                    req.url = '/' + req.url;
                }
                fileServer(req, res);
            })
            .listen(port, function() {

                plugins.util.log('Server is listening on ' + plugins.util.colors.magenta('http://localhost:' + port + '/'));
                next();
            });
    });


    gulp.task('serve', ['run'], function() {
        gulp.watch(['*.html']);
    });

};