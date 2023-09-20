module.exports = {
    options: {
        sourceMap: true,
        presets: ["env"],
        plugins: ["@babel/plugin-transform-classes"]
    },
    dist: {
        files: {
            "<%= paths.js.dist %>/advanced-search.js" : '<%= paths.js.src %>/index.js'
        }
    }
};
