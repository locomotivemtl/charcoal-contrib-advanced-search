module.exports = {
    options: {
        separator: ';'
    },
    advanced_search: {
        src: [
            '<%= paths.js.src %>/**/*.js',
        ],
        dest: '<%= paths.js.dist %>/advanced-search.js'
    }
};
