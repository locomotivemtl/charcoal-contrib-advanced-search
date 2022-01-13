module.exports = {
    options: {
        open:      false,
        proxy:     'charcoal-contrib-search-filter.test',
        port:      3000,
        watchTask: true,
        notify:    false
    },
    dev: {
        bsFiles: {
            src: [
                '<%= paths.prod %>/**/*'
            ]
        }
    }
};
