/* global Charcoal */
;(function ($) {
    /**
     * Property filter widget used for filtering a list
     * `charcoal/search-filter/widget/search-filter`
     *
     * Require:
     * - jQuery
     *
     * @param  {Object}  opts Options for widget
     */
    var PropertyFilter = function (opts) {
        if (!opts.data.properties_options) {
            opts.data.properties_options = {};
        }

        Charcoal.Admin.Widget.call(this, opts);
    };

    PropertyFilter.prototype             = Object.create(Charcoal.Admin.Widget.prototype);
    PropertyFilter.prototype.constructor = Charcoal.Admin.Widget_Property_Filter;
    PropertyFilter.prototype.parent      = Charcoal.Admin.Widget.prototype;

    PropertyFilter.prototype.init = function () {
        this.$form = this.element();

        this.$form.on('submit.charcoal.property.filter', function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.submit();
        }.bind(this));

        this.$form.on('click.charcoal.property.filter', '.js-filter-reset', this.clear.bind(this));

        };

    /**
     * Resets the filter widgets.
     *
     * @return this
     */
    PropertyFilter.prototype.clear = function () {
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
    PropertyFilter.prototype.submit = function () {
        var data, fields, filters = {}, manager, widgets, request;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data    = this.$form.serializeArray();
            fields  = this.$form.find(':input').serializeArray();

            $.each(fields, function (i, field) {
                var p_ident = field.name.replace(/(\[.*)/gi, '');
                if (!!field.value) {
                    if (!filters.hasOwnProperty(p_ident)) {
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
    PropertyFilter.prototype.prepare_request = function (p_filters) {
        var request = null, filters = [], sub_filters, opts, data = this.opts('data');

        $.each(p_filters, function (prop, filter_array) {
            sub_filters = [];
            $.each(filter_array, function (j, filter) {
                sub_filters.push({
                    property: prop,
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
    PropertyFilter.prototype.dispatch = function (request, widget) {
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

    Charcoal.Admin.Widget_Property_Filter = PropertyFilter;
}(jQuery));
