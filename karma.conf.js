module.exports = function(config) {
    config.set({
 
        // base path, that will be used to resolve files and exclude
        basePath: './',
 
        // frameworks to use
        frameworks: ['jasmine'],
 
        // list of files / patterns to load in the browser
        files: [
			{
				pattern: './tests/*.html',
				watched: false,
				served: true,
				included: false
			 },
			 './examples/css/basic-styles.css',
			'./examples/css/gravity-bubbles.css',
			'./tests/libs/*.js',
			'./src/js/gravity-bubbles.js',
			'./tests/*.tests.js',
			
        ],
		
        // list of files to exclude
        exclude: [
        ],
 
        // test results reporter to use
        reporters: ['progress'],
 
        // web server port
        port: 9876,
 
        // enable / disable colors in the output (reporters and logs)
        colors: true,
 
        // level of logging
        logLevel: config.LOG_INFO,
 
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
 
        // Start these browsers
        browsers: ['PhantomJS'],
 
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
 
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};