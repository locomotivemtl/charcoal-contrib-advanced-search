module.exports = {
    options: {
        separator: ';'
    },
    search_filter: {
        src: [
            '<%= paths.js.src %>/**/*.js',
        ],
        dest: '<%= paths.js.dist %>/search-filter.js'
    }
};
