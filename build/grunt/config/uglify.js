module.exports = {
    options: {
        banner: '/*! <%= package.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },
    app: {
        files: {
            '<%= paths.js.dist %>/charcoal.advanced-search.min.js': [
                '<%= concat.advanced_search.dest %>'
            ]
        }
    }
};
