/* global Charcoal */
;(function ($) {
    /**
     * Advanced search widget used for filtering a list
     * `charcoal/advanced-search/widget/advanced-search`
     *
     * Require:
     * - jQuery
     *
     * @param  {Object}  opts Options for widget
     */
    var AdvancedSearch = function (opts) {
        console.log(opts);
        if (!opts.data.properties_options) {
            opts.data.properties_options = {};
        }

        Charcoal.Admin.Widget.call(this, opts);
    };

    AdvancedSearch.prototype             = Object.create(Charcoal.Admin.Widget.prototype);
    AdvancedSearch.prototype.constructor = Charcoal.Admin.Widget_Advanced_Search;
    AdvancedSearch.prototype.parent      = Charcoal.Admin.Widget.prototype;

    AdvancedSearch.prototype.init = function () {
        this.$form = this.element();
        this.$applyBtn = $('.js-filter-apply', this.$form);

        this.$form.on('submit.charcoal.search.filter', function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.submit();
        }.bind(this));

        this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this));

        $('.c-filters-tab').on('click', function() {
            var tab_key = $(this).attr('data-tab');

            // Activate tab button
            $('.c-filters-tab').removeClass('active');
            $('.c-filters-tab button i').addClass('fa-angle-down');
            // Flip arrow
            $(this).addClass('active');
            $('button i', this).removeClass('fa-angle-down').addClass('fa-angle-up');

            // Active tab field group
            $('.c-filter-group.active').removeClass('active');
            $('.c-filter-group[data-tab="' + tab_key + '"]').addClass('active');
        });

        if ($('.c-filters-tab.active').length === 0) {
            $('.c-filters-tab').first().click();
        }

        var widget = this;

        var onChange = function () {
            // Check for inputs with values
            if (!$(this).is('input, select')) {
                $(this).find('input, select').addClass('changed');
            } else {
                $(this).addClass('changed');
            }
            widget.countChanges();
        };

        $('input, select', this.$form).on('change', onChange);
        $('.datetimepickerinput', this.$form).on('change.datetimepicker', onChange);
    };

    AdvancedSearch.prototype.countChanges = function () {
        var changeCount = $('input.changed, select.changed', this.$form).length;
        var changeCountString = '';

        if (changeCount > 0) {
            changeCountString = '(' + changeCount + ')';
            $('.js-filter-apply, .js-filter-reset', this.$form).prop('disabled', false);
        } else {
            $('.js-filter-apply, .js-filter-reset', this.$form).prop('disabled', true);
        }

        // Set the label to singular/plural format
        $('.btn-label span.active', this.$applyBtn).removeClass('active');

        if (changeCount === 1) {
            $('.btn-label-singular', this.$applyBtn).addClass('active');
        } else {
            $('.btn-label-plural', this.$applyBtn).addClass('active');
        }

        // Apppend change count to apply button
        $('.filter-apply-count', this.$applyBtn).text(changeCountString);
    };

    /**
     * Resets the filter widgets.
     *
     * @return this
     */
    AdvancedSearch.prototype.clear = function () {
        // this.$input.val('');
        this.$form[0].reset();
        this.$form.find('select').selectpicker('refresh');
        $('.datetimepickerinput').datetimepicker('clear');
        $('input.changed, select.changed', this.$form).removeClass('changed');
        this.countChanges();
        this.submit();
        return this;
    };

    /**
     * Filter object definition
     * 
     * @param {object} name Input dom object.
     * @param {string} name Filter name.
     * @param {string} value Filter value.
     */
    AdvancedSearch.prototype.filterObj = function (input, name, value) {
        var formField = $(input).closest('.form-field');

        this.name = name;
        this.value = value;
        this.operator = formField.data('operator').length > 0 ? formField.data('operator') : '=';
        this.type = input.type;

        // switch checkbox
        if (this.type === 'checkbox') {
            this.value = input.checked;
        }

        if (name.endsWith("[from]") || name.endsWith("[to]")) {
            this.type = 'daterange';
            this.operator = 'BETWEEN';
            this.matching = name.endsWith('[from]') ? name.replace('[from]', '[to]') : name.replace('[to]', '[from]');
        }
    };

    /**
     * Submit the filters to all widgets
     *
     * @return this
     */
    AdvancedSearch.prototype.submit = function () {
        var data, fields, filters = {}, manager, widgets, request;
        var that = this;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data    = this.$form.serializeArray();
            fields  = this.$form.find(':input.changed');

            $.each(fields, function (i, field) {
                var p_ident = field.name.replace(/(\[.*)/gi, '');

                if (!!field.value) {
                    console.log(field);
                    if (!filters.hasOwnProperty(p_ident)) {
                        filters[p_ident] = [];
                    }

                    filters[p_ident].push(new that.filterObj(field, field.name, field.value));
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
    AdvancedSearch.prototype.prepare_request = function (p_filters) {
        var request = null, filters = [], sub_filters, opts, data = this.opts('data');
        var collection_table = this.opts('collection_table');

        $.each(p_filters, function (prop, filter_obj) {
            sub_filters = [];
            opts = data.properties_options[prop] || {};
            var filter_table = null;

            if (typeof opts.table !== 'undefined' && opts.table !== collection_table) {
                filter_table = opts.table || null;
            }

            $.each(filter_obj, function (j, filter) {
                if (typeof filter !== 'undefined') {
                    var value_override = [];

                    if (filter.type === 'daterange') {
                        // Is daterange input
                        var matching_value = $('input[name="'+ filter.matching +'"]').val();

                        if (filter.name.endsWith('[from]')) {
                            value_override.push(filter.value);
                            value_override.push(matching_value);
                        } else {
                            value_override.push(matching_value);
                            value_override.push(filter.value);
                        }

                        p_filters[prop].pop();
                    }

                    sub_filters.push({
                        property: prop,
                        value:    value_override.length ? value_override : filter.value,
                        operator: filter.operator
                    });
                }
            });

            filters.push({
                conjunction: opts.conjunction || 'AND',
                table:       filter_table,
                filters:     sub_filters
            });
        });

        if (filters.length) {
            request = {
                filters: filters,
                table:   collection_table
            };
        }

        console.log(filters);

        return request;
    };

    /**
     * Dispatches the event to all widgets that can listen to it
     *
     * @param  {object} request - The search request.
     * @param  {object} widget  - The widget to search on.
     * @return this
     */
    AdvancedSearch.prototype.dispatch = function (request, widget) {
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

    Charcoal.Admin.Widget_Advanced_Search      = AdvancedSearch;
    Charcoal.Admin.Widget_Advanced_Search_Tabs = AdvancedSearch;
}(jQuery));
