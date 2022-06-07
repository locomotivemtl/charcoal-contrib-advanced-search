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
        if (!opts.data.properties_options) {
            opts.data.properties_options = {};
        }
        Charcoal.Admin.Widget.call(this, opts);
    };

    AdvancedSearch.prototype             = Object.create(Charcoal.Admin.Widget.prototype);
    AdvancedSearch.prototype.constructor = Charcoal.Admin.Widget_Advanced_Search;
    AdvancedSearch.prototype.parent      = Charcoal.Admin.Widget.prototype;

    AdvancedSearch.prototype.init = function () {
        this.$form             = this.element();
        this.$applyBtn         = $('.js-filter-apply', this.$form);
        this.$sortBtn          = $('.sort-dropdown', this.$form);
        this.$activeFilterList = $('.active-filters', this.$form);
        this.totalRows         = 0;
        this.isReloading       = false;

        this.$form.on('submit.charcoal.search.filter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        }.bind(this));

        this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this));

        // Handle change sorting
        this.$form.on(
            'click.charcoal.search.filter',
            '.sort-dropdown + .dropdown-menu>.dropdown-item',
            this.sort.bind(this)
        );

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
        var onChange = function (e) {
            // Add item to active-filters list
            var targetFilter  = e.target;
            var filterWrapper = $(targetFilter).closest('fieldset');
            var formField     = $(targetFilter).attr('id');
            var filterName    = $('label', filterWrapper).first().text();
            var filterVal     = $(targetFilter).val();
            var filterType    = 'input';

            // Date
            if (typeof e.date !== 'undefined') {
                var filterInput     = $('input', targetFilter).first();
                var filterInputName = filterInput.attr('name');
                formField           = filterInput.attr('id');

                if (filterInputName.endsWith("[to]") || filterInputName.endsWith("[from]")) {
                    // Is a date range
                    filterType = 'date-range';
                    var primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
                    var dates = [
                        $('input[name="'+ primaryName +'[from]"]').val() || null,
                        $('input[name="'+ primaryName +'[to]"]').val()   || null
                    ].filter(function (element) {
                        return element !== null;
                    });

                    filterVal = dates.join(' - ');
                } else {
                    filterType = 'date';
                    filterVal = filterInput.val();
                }
            }

            // Select
            if (targetFilter.tagName === 'SELECT') {
                filterType = 'select';
                filterVal = Array.from(targetFilter.selectedOptions).map(function (option) {
                    return option.value ? option.innerHTML : null;
                })
                .filter(function (element) {
                    return element !== null;
                })
                .join(', ');
            }

            if (targetFilter.type === 'checkbox') {
                filterType = 'checkbox';
                filterVal = $(targetFilter).is(':checked') ? ($('html').attr('lang') === 'fr' ? 'Oui' : 'Yes') : '';
            }

            if (!filterVal.length) {
                widget.removeActiveFilter(formField);
                if (!$(this).is('input, select')) {
                    $(this).find('.changed').removeClass('changed');
                } else {
                    $(this).removeClass('changed');
                }
            } else {
                widget.updateActiveFilter(formField, filterName, filterVal, filterType);
                // Check for inputs with values
                if (!$(this).is('input, select')) {
                    $(this).find('input, select').addClass('changed');
                } else {
                    $(this).addClass('changed');
                }
            }

            widget.countChanges();
        };

        $('input, select', this.$form).on('change', onChange);
        $('.datetimepickerinput', this.$form).on('change.datetimepicker', onChange);
    };

    /**
     * Add Active Filter.
     *
     * @param {string} id Unique ID.
     * @param {string} label Filter label.
     * @param {string} value Filter value.
     * @param {string} type The type of the filter.
     */
    AdvancedSearch.prototype.addActiveFilter = function (id, label, value, type) {
        var listItem = $('<li></li>')
            .append($('<span></span>').addClass('label').text(label).attr('title', label))
            .append($('<span></span>').addClass('value').text(value).attr('title', value))
            .append($('<div></div>').addClass('remove fa fa-times').on('click', this.removeActiveFilter.bind(this)))
            .attr('data-key', id)
            .attr('data-type', type);
        $(this.$activeFilterList).append(listItem);
    };

    /**
     * Update Active Filter.
     *
     * @param {string} filterId Unique ID.
     * @param {string} label Filter label.
     * @param {string} value Filter value.
     * @param {string} [filterType] The type of the filter.
     */
    AdvancedSearch.prototype.updateActiveFilter = function (filterId, label, value, filterType) {
        var filterIdClean = this.cleanFilterId(filterId);
        var listItem = $('li[data-key="'+ filterIdClean +'"]', this.$activeFilterList);
        var type = $(listItem).data('type') || filterType || 'input';

        if (listItem.length) {
            $(listItem).attr('data-type', type);
            $('.label', listItem).text(label).attr('title', label);
            $('.value', listItem).text(value).attr('title', value);
        } else {
            this.addActiveFilter(filterIdClean, label, value, type);
        }
    };

    /**
     * Count total active filters.
     * 
     * @returns {int} Total active filters.
     */
    AdvancedSearch.prototype.countActiveFilters = function () {
        return $('li', this.$activeFilterList).length;
    };

    /**
     * Clean filter ID of 'from'/'to'.
     *
     * @param {string} filterId
     * @returns 
     */
    AdvancedSearch.prototype.cleanFilterId = function (filterId) {
        var filterIdClean = filterId;

        if (filterId.includes('from_input_') || filterId.includes('to_input_')) {
            filterIdClean = filterIdClean.replace('from_', '').replace('to_', '');
        }

        return filterIdClean;
    };

    /**
     * Remove item from active filter list.
     *
     * @param {event|string} e Remove Event or target string.
     */
    AdvancedSearch.prototype.removeActiveFilter = function (e) {
        var target = e;

        if (typeof target === 'string') {
            target = this.cleanFilterId(target);
            target = $('li[data-key="'+ target +'"]', this.$activeFilterList);
        } else {
            target = e.target;
        }

        var listItem = $(target).closest('li');

        if (listItem.length) {
            if (this.countActiveFilters() === 1) {
                this.clear();
                return;
            }

            this.clearFilter(listItem);
            listItem.remove();
        }
    };

    AdvancedSearch.prototype.setTotalRows = function (totalRows) {
        this.totalRows = totalRows;
        var totalRowsEl = $('.filters-total-rows').first();
        totalRowsEl.find('.row-count').text(this.totalRows);
        totalRowsEl.attr('data-count', this.totalRows);
    };

    /**
     * Count all changed filters.
     *
     * @returns {int} Change count.
     */
    AdvancedSearch.prototype.countChanges = function () {
        var changeCount       = $('input.changed, select.changed', this.$form).length;
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

        // Append change count to apply button
        $('.filter-apply-count', this.$applyBtn).text(changeCountString);

        // Add tab filter count to tab label
        $('.c-filter-group').each(function () {
            var tabChangeCount   = $('input.changed, select.changed', this).length;
            var tabFilterCountEl = $('.c-filters-tab[data-tab="'+ $(this).data('tab') +'"] .tab-filter-count');

            tabFilterCountEl.attr('data-count', tabChangeCount);
            tabFilterCountEl.find('.count').text(tabChangeCount);
        });

        return changeCount;
    };

    /**
     * Resets the filter widgets.
     *
     * @return this
     */
    AdvancedSearch.prototype.clear = function () {
        // Reset form
        this.$form[0].reset();
        // Clear selects
        this.$form.find('select').selectpicker('refresh');
        // Clear date pickers
        $('.datetimepickerinput').datetimepicker('clear');
        // Set changed inputs to unchanged state
        $('input.changed, select.changed', this.$form).removeClass('changed');

        this.countChanges();

        // Clear active filter list
        $('li', this.$activeFilterList).remove();
        // Reset sort dropdown
        $(this.$sortBtn).removeClass('selected');

        this.submit();
        return this;
    };

    /**
     * Resets a filter.
     *
     * @param {string} filterId Filter ID.
     * @return this
     */
    AdvancedSearch.prototype.clearFilter = function (listItem) {
        if (!$(listItem).length) {
            return;
        }

        var filterId     = $(listItem).data('key');
        var listItemType = $(listItem).data('type');
        var filterInput, filterType;

        if (listItemType.includes('date')) {
            // Handle date pickers
            if (listItemType === 'date-range') {
                // Date Range
                filterType  = 'date-range';
                filterInput = $('#from_'+ filterId, this.$form);
            } else {
                // Single Date
                filterType  = 'date';
                filterInput = $('#'+ filterId, this.$form);
            }
        } else {
            // Handle all inputs
            filterInput = $('#'+ filterId, this.$form);
            filterType  = filterInput[0].type;
        }

        // Reset respective input
        switch (filterType) {
            case 'checkbox':
                filterInput.prop('checked', false);
                break;

            case 'select-one':
            case 'select-multiple':
                $(filterInput).val('');
                $(filterInput).selectpicker('refresh');
                break;

            case 'date-range':
                filterInput.closest('fieldset').find('.datetimepickerinput').datetimepicker('clear');
                filterInput.closest('fieldset').find('.changed').removeClass('changed');
                break;

            default:
                filterInput.val('');
                break;
        }

        $(filterInput).removeClass('changed');

        return this;
    };

    /**
     * Change the widget sorting order.
     *
     * @param {object} e Event.
     * @return this
     */
    AdvancedSearch.prototype.sort = function (e) {
        var optionEl = $(e.target).closest('.dropdown-item');
        var label    = $('.btn-label', optionEl).text();

        if ($(optionEl).hasClass('default')) {
            // Reset button to default sort
            $(this.$sortBtn).removeClass('selected');
        } else {
            // Perform sort
            $(this.$sortBtn).addClass('selected').data({
                property:  optionEl.data('property'),
                direction: optionEl.data('direction')
            });
            $('.sort-option', this.$sortBtn).find('.sort-option-value').text(label);
        }

        this.submit();

        return this;
    };

    /**
     * Filter object definition.
     *
     * @param {object} name Input dom object.
     * @param {string} name Filter name.
     * @param {string} value Filter value.
     */
    AdvancedSearch.prototype.filterObj = function (input, name, value) {
        var formField    = $(input).closest('.form-field');
        var dataOperator = formField.data('operator') || '';

        this.name     = name;
        this.value    = value;
        this.operator = '=';
        this.type     = input.type;

        this.parseInvalidBetween = function (name, value) {
            this.type     = 'date';
            this.value    = value;
            this.operator = name.endsWith("[from]") ? '>' : '<';
        };

        if (dataOperator.length) {
            this.operator = dataOperator;
        }

        // text field
        if (this.type === 'text' && this.operator === 'LIKE') {
            this.value = '%' + this.value + '%';
        }

        // switch checkbox
        if (this.type === 'checkbox') {
            this.value = input.checked;
        }

        if (this.type === 'select-multiple') {
            this.value    = $(input).val();
            this.operator = "IN";
        }

        if (name.endsWith("[from]") || name.endsWith("[to]")) {
            this.type     = 'daterange';
            this.operator = 'BETWEEN';
            this.matching = name.endsWith('[from]') ? name.replace('[from]', '[to]') : name.replace('[to]', '[from]');

            var matching_value = $('input[name="'+ this.matching +'"]').val();

            if (!this.value.length || !matching_value.length) {
                if (!this.value.length) {
                    this.parseInvalidBetween(this.matching, matching_value);
                } else {
                    this.parseInvalidBetween(this.name, this.value);
                }
            }
        }
    };

    /**
     * Submit the filters to all widgets.
     *
     * @return this
     */
    AdvancedSearch.prototype.submit = function () {
        var data, fields, filters = [], manager, widgets, request;
        var that = this;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data    = this.$form.serializeArray();
            fields  = this.$form.find(':input.changed');

            $.each(fields, function (i, field) {
                if (!!field.value) {
                    filters.push(new that.filterObj(field, field.name, field.value));
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
        var request          = null, filters = [], opts;
        var data             = this.opts('data');
        var orderProperty    = $(this.$sortBtn).data('property');
        var collection_table = this.opts('collection_table');

        $.each(p_filters, function (key, filter_obj) {
            var propName       = filter_obj.name.replace(/(\[.*)/gi, '');
            var filter_table   = null;
            var value_override = [];

            opts = data.properties_options[propName] || {};

            if (typeof opts.table !== 'undefined' && opts.table !== collection_table) {
                filter_table = opts.table || null;
            }

            if (typeof filter_obj !== 'undefined') {
                if (filter_obj.type === 'daterange') {
                    // Is daterange input
                    if (filter_obj.operator === 'BETWEEN' && filter_obj.name.endsWith('[to]')) {
                        return false;
                    }

                    var matching_value = $('input[name="'+ filter_obj.matching +'"]').val();

                    if (filter_obj.name.endsWith('[from]')) {
                        value_override = [ filter_obj.value, matching_value ];
                    } else {
                        value_override = [ matching_value, filter_obj.value ];
                    }
                }
            }

            filters.push({
                conjunction: opts.conjunction || 'AND',
                table:       filter_table,
                property:    propName,
                value:       value_override.length ? value_override : filter_obj.value,
                operator:    filter_obj.operator
            });
        });

        request = {
            filters: null,
            orders:  null,
        };

        if (filters.length) {
            request.filters = {
                filters: filters,
                table:   collection_table
            };
        }

        if ($(this.$sortBtn).hasClass('selected') && orderProperty) {
            request.orders = {
                direction: $(this.$sortBtn).data('direction'),
                mode:      $(this.$sortBtn).data('direction'),
                property:  orderProperty
            };
        }

        console.log('Filters:', filters);

        return request;
    };

    /**
     * Dispatches the event to all widgets that can listen to it.
     *
     * @param  {object} request - The search request.
     * @param  {object} widget  - The widget to search on.
     * @return this
     */
    AdvancedSearch.prototype.dispatch = function (request, widget) {
        if (this.isReloading || !widget || typeof widget.set_filters !== 'function') {
            return this;
        }

        if (typeof widget.pagination !== 'undefined') {
            widget.pagination.page = 1;
        }

        var filters = [];
        if (request.filters) {
            filters.push(request.filters);
        }

        widget.set_filters(filters);

        var orders = [];
        if (request.orders) {
            orders.push(request.orders);
        }

        $(this.$form).addClass('loading');
        this.isReloading = true;

        widget.set_orders(orders);

        widget.reload(function (response) {
            if (response) {
                this.setTotalRows(response.widget_data.total_rows);
            }
            $(this.$form).removeClass('loading');
            this.isReloading = false;
        }.bind(this), true);

        return this;
    };

    Charcoal.Admin.Widget_Advanced_Search      = AdvancedSearch;
    Charcoal.Admin.Widget_Advanced_Search_Tabs = AdvancedSearch;
}(jQuery));
