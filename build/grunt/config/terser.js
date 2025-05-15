module.exports = {
    app: {
        files: {
            '<%= paths.js.dist %>/charcoal.advanced-search.min.js': [
                '<%= concat.advanced_search.dest %>'
            ]
        }
    }
};
