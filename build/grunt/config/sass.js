module.exports = {
    options: {
        sourceMap:   false,
        outputStyle: 'expanded'
    },
    app: {
        files: {
            '<%= paths.css.dist %>/charcoal.search-filter.css': '<%= paths.css.src %>/**/charcoal.search-filter.scss'
        }
    },
    vendors: {
        files: {
            '<%= paths.css.dist %>/charcoal.search-filter.vendors.css': '<%= paths.css.src %>/**/charcoal.search-filter.vendors.scss'
        }
    }
};
