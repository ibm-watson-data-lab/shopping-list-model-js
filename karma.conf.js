module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai"],
    files: [
      { pattern: "./test/**/*Test.js", watched: false }
    ],
    preprocessors: {
      "./test/**/*Test.js": ["webpack", "sourcemap"]
    },
    reporters: ["dots"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    webpack: {
      resolve: {
        mainFields: ["browser", "main", "module"]
      },
      devtool: "inline-source-map"
    },
    concurrency: Infinity
  })
}
