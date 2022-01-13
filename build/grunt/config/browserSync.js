module.exports = {
    options: {
        open:      false,
        proxy:     'charcoal-contrib-advanced-search.test',
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
