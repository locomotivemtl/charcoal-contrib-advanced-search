/* global Charcoal */
;(function ($) {
    /**
     * Search filter widget used for filtering a list
     * `charcoal/search-filter/widget/search-filter`
     *
     * Require:
     * - jQuery
     *
     * @param  {Object}  opts Options for widget
     */
    var SearchFilter = function (opts) {
        if (!opts.data.properties_options) {
            opts.data.properties_options = {};
        }

        Charcoal.Admin.Widget.call(this, opts);
    };

    SearchFilter.prototype             = Object.create(Charcoal.Admin.Widget.prototype);
    SearchFilter.prototype.constructor = Charcoal.Admin.Widget_Search_Filter;
    SearchFilter.prototype.parent      = Charcoal.Admin.Widget.prototype;

    SearchFilter.prototype.init = function () {
        this.$form = this.element();

        this.$form.on('submit.charcoal.search.filter', function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.submit();
        }.bind(this));

        this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this));
    };

    /**
     * Resets the filter widgets.
     *
     * @return this
     */
    SearchFilter.prototype.clear = function () {
        // this.$input.val('');
        this.$form[0].reset();
        this.$form.find('select').selectpicker('refresh');
        this.submit();
        return this;
    };

    /**
     * Submit the filters to all widgets
     *
     * @return this
     */
    SearchFilter.prototype.submit = function () {
        var data, fields, filters = {}, manager, widgets, request;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data    = this.$form.serializeArray();
            fields  = this.$form.find(':input').serializeArray();

            $.each(fields, function (i, field) {
                var p_ident = field.name.replace(/(\[.*)/gi, '');
                if (!!field.value) {
                    if (!filters.hasOwnSearch(p_ident)) {
                        filters[p_ident] = [];
                    }

                    filters[p_ident].push(field.value);
                }
            });

            request = this.prepare_request(filters);

            $.each(widgets, function (i, widget) {
                this.dispatch(request, widget);
            }.bind(this));
        }

        return this;
    };

    /**
     * Prepares a search request from a query.
     *
     * @param  {array} query - The filters.
     * @return {object|null} A search request object or NULL.
     */
    SearchFilter.prototype.prepare_request = function (p_filters) {
        var request = null, filters = [], sub_filters, opts, data = this.opts('data');

        $.each(p_filters, function (prop, filter_array) {
            sub_filters = [];
            $.each(filter_array, function (j, filter) {
                sub_filters.push({
                    search: prop,
                    value:    filter
                });
            });

            opts = data.properties_options[prop] || {};

            filters.push({
                conjunction: opts.conjunction || 'AND',
                filters:     sub_filters
            });
        });

        if (filters.length) {
            request = {
                filters: filters
            };
        }

        return request;
    };

    /**
     * Dispatches the event to all widgets that can listen to it
     *
     * @param  {object} request - The search request.
     * @param  {object} widget  - The widget to search on.
     * @return this
     */
    SearchFilter.prototype.dispatch = function (request, widget) {
        if (!widget) {
            return this;
        }

        if (typeof widget.set_filters !== 'function') {
            return this;
        }

        if (typeof widget.pagination !== 'undefined') {
            widget.pagination.page = 1;
        }

        var filters = [];
        if (request) {
            filters.push(request);
        }

        widget.set_filters(filters);

        widget.reload();

        return this;
    };

    Charcoal.Admin.Widget_Search_Filter = SearchFilter;
}(jQuery));
