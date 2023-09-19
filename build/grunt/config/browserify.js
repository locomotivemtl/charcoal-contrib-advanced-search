module.exports = {
    production: {
        src: [
            "<%= paths.js.src %>/index.js"
        ],
        dest: '<%= paths.js.dist %>/advanced-search.js',
        options: {
            browserifyOptions: { debug: false },
            transform: [["babelify", {
                presets: ["@babel/preset-env"],
                plugins: ["@babel/plugin-transform-classes"]
            }]]
        }
    }
};
