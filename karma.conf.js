// karma-browserify karma.conf.js

// Karma configuration
// Generated on Sat Dec 16 2017 16:32:55 GMT+0600 (Bangladesh Standard Time)
module.exports = function (config) {
    let configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'browserify'],


        // list of files / patterns to load in the browser
        files: [
            'src/js/utils.js',
            // 'test/**/*.js',
            'tests/libs/*.*',
            'tests/**/*.[sS]pec.js',
            'dist/js/*.js',
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'dist/*.js': ['coverage'],
            'tests/**/*.[sS]pec.js': ['browserify'],
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
        browsers: ['Chrome','PhantomJS'],
        customLaunchers: {
            // tell TravisCI to use chromium when testing
            Chrome_travis_ci: {
                base: "Chrome",
                flags: [
                    "--headless",
                    "--disable-gpu",
                    "--remote-debugging-port-9222",
                    '--no-sandbox'
                ]
            }
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        coverageReporter: {
            dir: './coverage',
            reporters: [
                {type: 'lcov', subdir: '.'},
                {type: 'text-summary'}
            ]
        },
        coverageIstanbulReporter: {
            reports: [ 'html', 'lcovonly', 'text-summary', 'cobertura' ],
            fixWebpackSourcePaths: true,
            thresholds: {
                statements: 100,
                lines: 100,
                branches: 100,
                functions: 100
            }
        },
    };
    config.set(configuration);

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }
}
