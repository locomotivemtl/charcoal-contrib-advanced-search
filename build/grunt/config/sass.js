module.exports = {
    options: {
        sourceMap:   false,
        outputStyle: 'expanded'
    },
    app: {
        files: {
            '<%= paths.css.dist %>/charcoal.advanced-search.css': '<%= paths.css.src %>/**/charcoal.advanced-search.scss'
        }
    },
    vendors: {
        files: {
            '<%= paths.css.dist %>/charcoal.advanced-search.vendors.css': '<%= paths.css.src %>/**/charcoal.advanced-search.vendors.scss'
        }
    }
};
