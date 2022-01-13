module.exports = {
    options: {
        banner: '/*! <%= package.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },
    app: {
        files: {
            '<%= paths.js.dist %>/charcoal.search-filter.min.js': [
                '<%= concat.search_filter.dest %>'
            ]
        }
    }
};
