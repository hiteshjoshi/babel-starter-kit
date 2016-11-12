import path from 'path';
import minimist from 'minimist';
import webpack from 'webpack';
import fs from 'fs';

let knownOptions = {
    string: 'min',
    default: {
        'min': false
    }
};

const options = minimist(process.argv.slice(2), knownOptions),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    currentYear = (new Date()).getFullYear();

let plugins = [
    new webpack.DefinePlugin({
        'ENVIRONMENT': JSON.stringify((process.env.NODE_ENV || 'development')),
        'VERSION': JSON.stringify(require('./package.json').version),
        'API': JSON.stringify(process.env.NODE_ENV == 'production' ? "https://rightfit.io/api" : (process.env.NODE_ENV == 'staging' ? "https://staging.rightfit.io/api" : "http://rightfit.lol/api"))
    }), new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vendor", /* filename= */ "vendor.js"), new webpack.optimize.DedupePlugin(), new webpack.ProvidePlugin({
        // Automtically detect jQuery and $ as free var in modules
        // and inject the jquery library
        // This is required by many jquery plugins
        jQuery: 'jquery-slim',
        $: 'jquery-slim',
        m: 'mithril',
        Bullet: 'bullet',
        Auth: 'modules/auth',
        page: 'page',
        restful: 'restful.js',
        _: 'lodash'
            //URI:'URI',
            // graphed: "graphed",
            // graphed: "graphed"
    })
]


let webp_options = {
    cache: true,
    debug: true,
    entry: {
        app: ["bullet", "app"],

        vendor: ["jquery-slim", "mithril"]

        //bootstrap: ["!bootstrap-webpack!./app/bootstrap/bootstrap.config.js", "./app/bootstrap"],
        //react: "./app/react"
    },
    output: {
        path: path.join(__dirname, "public"),
        publicPath: "./",
        filename: "[name].bundle.min.js",
        chunkFilename: "[id].bundle.min.js"
    },
    module: {
        loaders: [{
                test: /(\.jsx|\.js)$/, // Match both .js and .jsx
                exclude: /node_modules/,
                loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0']
                }
            }
            // required to write "require('./style.css')"
            //{ test: /\.css$/,    loader: "style-loader!css-loader" },

            // required for bootstrap icons
            //{ test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
            //{ test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
            //{ test: /\.eot$/,    loader: "file-loader?prefix=font/" },
            //{ test: /\.svg$/,    loader: "file-loader?prefix=font/" },

            // required for react jsx
            //, { test: /\.jsx$/, loader: "msx-loader" },
            //,{ test: /\.jsx$/,   loader: "msx-loader?insertPragma=React.DOM" },
        ]
    },
    resolve: {
        alias: {
            'app': path.join(__dirname, "client/app.js"),
            'form': __dirname + '/less/definitions/behaviors/form.js',
            'modules': __dirname + '/client/modules/',
            'transition': __dirname + '/less/definitions/modules/transition.js',
            'progress': __dirname + '/less/definitions/modules/progress.js',
            'visibility': __dirname + '/less/definitions/behaviors/visibility.js',
            'sidebar': __dirname + '/less/definitions/modules/sidebar.js',
            'dropdown': __dirname + '/less/definitions/modules/dropdown.js',
            'tab': __dirname + '/less/definitions/modules/tab.js',
            'modal': __dirname + '/less/definitions/modules/modal.js',
            'checkbox': __dirname + '/less/definitions/modules/checkbox.js',
            'popup': __dirname + '/less/definitions/modules/popup.js',
            'modal': __dirname + '/less/definitions/modules/modal.js',
            'dimmer': __dirname + '/less/definitions/modules/dimmer.js',
            'dropdown': __dirname + '/less/definitions/modules/dropdown.js',
            'bullet': __dirname + '/plugins/bullet.js',
            'lodash': __dirname + '/plugins/lodash.js',
            'jquery-slim': __dirname + '/node_modules/jquery/dist/jquery.js',
            'mithril': __dirname + '/plugins/mithril.js',
            'mjsx_loader': __dirname + '/plugins/mjsx_loader.js',
            'js': __dirname + '/plugins/',
            'magnific': __dirname + '/plugins/jquery.magnific-popup.js',
            'css': __dirname + '/plugins/css',
            'datepicker': __dirname + '/plugins/datepicker'

            // // Bind version of jquery
            // jquery: "jquery-2.0.3",

            // // Bind version of jquery-ui
            // "jquery-ui": "jquery-ui-1.10.3",

            // // jquery-ui doesn't contain a index file
            // // bind module to the complete module
            // "jquery-ui-1.10.3$": "jquery-ui-1.10.3/ui/jquery-ui.js",
        }
    },
    plugins: plugins
};


if (options.min !== false) {
    plugins.push((new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        },
        minimize: true
    })))
}


//banner comment
plugins.push((new webpack.BannerPlugin([
    pkg.name + " v" + pkg.version,
    pkg.description,
    pkg.homepage,
    "Copyright (c) 2015-" + currentYear + " HATCH IT UP, Inc. All Rights Reserved.",
    "Are you a frontend Ninja? work with us! email at " + pkg.career
].join("\n"), {
    entryOnly: true
})))

module.exports = webp_options