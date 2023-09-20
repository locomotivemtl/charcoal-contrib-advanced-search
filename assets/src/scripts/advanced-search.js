/* global Charcoal */
import AdvancedSearchFilterRecap from "./filter-recap";

const widgetL10n = window.widgetL10n || {};
const $ = jQuery;

/**
 * Advanced search widget used for filtering a list
 * `charcoal/advanced-search/widget/advanced-search`
 *
 * Require:
 * - jQuery
 *
 * @param  {Object}  opts Options for widget
 */
class AdvancedSearch extends Charcoal.Admin.Widget {

    constructor(opts) {
        if (!opts.data.properties_options) {
            opts.data.properties_options = {};
        }
        super(opts);
        Charcoal.Admin.Widget.call(this, opts);
    }

    init() {
        this.$form             = this.element();
        this.$applyBtn         = $('.js-filter-apply', this.$form);
        this.$exportBtn        = $('.js-filter-export', this.$form);
        this.$sortBtn          = $('.sort-dropdown', this.$form);
        this.$activeFilterList = $('.active-filters', this.$form);
        this.totalRows         = 0;
        this.isReloading       = false;
        this.clearOnEmpty      = false;

        // This is used to display the filters
        this.filterRecap = new AdvancedSearchFilterRecap(this.$form, this.$activeFilterList, this);

        this.$form.on('submit.charcoal.search.filter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        }.bind(this));

        const that = this;
        this.$activeFilterList.on('click', '.js-remove-filter', function (e) {
            that.filterRecap.removeActiveFilter(e.target);

            // Clear everything if that was the last filter.
            if (this.clearOnEmpty && this.countChanges() === 0) {
                this.clear();
            }
        });

        this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this));

        // Handle change sorting
        this.$form.on(
            'click.charcoal.search.filter',
            '.sort-dropdown + .dropdown-menu>.dropdown-item',
            this.sort.bind(this)
        );

        $('.c-filters-tab').on('click', function () {
            const tab_key = $(this).attr('data-tab');

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

        const widget = this;

        $(this.$exportBtn).on('click', function () {
            widget.export();
            return false;
        });

        $('input, select', this.$form).on('change', (e) => widget.onFieldChange(e));
        $('.datetimepickerinput', this.$form).on('change.datetimepicker', (e) => widget.onFieldChange(e));
        $($('input:not([type=hidden]), select:not([type=hidden])', this.$form)[0]).trigger('change');

        if (this.countActiveFilters() > 0) {
            this.clearOnEmpty = true;

            const manager = Charcoal.Admin.manager();
            manager.ready(() => { 
                const widgets = manager.components.widgets;

                if (widgets.length > 0) {
                    widgets.forEach(function (widget) {
                        if (!widget || typeof widget.set_filters !== 'function') {
                            return this;
                        }

                        const total_rows = widget.opts('data').total_rows ?? null;

                        if (total_rows !== null) {
                            this.setTotalRows(total_rows);
                        }
                    }.bind(this));
                }
            });
        }
    }

    onFieldChange(e) {
        // Add item to active-filters list
        const widget = this;
        const targetFilter = e.target;
        let formField    = $(targetFilter).attr('id');
        let filterVal    = $(targetFilter).val();

        // Checkboxes are different!
        if (e.target.type === 'checkbox') {
            filterVal = $(targetFilter).is(':checked') ? 'checked' : '';
        }

        // Date
        if (typeof e.date !== 'undefined') {
            const filterInput     = $('input', targetFilter).first();
            const filterInputName = filterInput.attr('name');
            formField             = filterInput.attr('id');

            if (filterInputName.endsWith("[to]") || filterInputName.endsWith("[from]")) {
                // Is a date range
                const primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
                const dates = [
                    $('input[name="' + primaryName + '[from]"]').val() || null,
                    $('input[name="' + primaryName + '[to]"]').val()   || null
                ].filter(function (element) {
                    return element !== null;
                });

                filterVal = dates.join(' - ');
            } else {
                filterVal = filterInput.val();
            }
        }

        if (!filterVal.length) {
            widget.removeActiveFilter(formField);
            if (!$(targetFilter).is('input, select')) {
                $(targetFilter).find('.changed').removeClass('changed');
            } else {
                $(targetFilter).removeClass('changed');
            }
        } else {
            // Check for inputs with values
            if (!$(targetFilter).is('input, select')) {
                $(targetFilter).find('input, select').addClass('changed');
            } else {
                $(targetFilter).addClass('changed');
            }
        }

        widget.filterRecap.refresh();
        widget.countChanges();
    }

    /**
     * Count total active filters.
     *
     * @returns {int} Total active filters.
     */
    countActiveFilters() {
        return $('li', this.$activeFilterList).length;
    }

    /**
     * Clean filter ID of 'from'/'to'.
     *
     * @param {string} filterId
     * @returns
     */
    cleanFilterId(filterId) {
        let filterIdClean = filterId;

        if (filterId.includes('from_input_') || filterId.includes('to_input_')) {
            filterIdClean = filterIdClean.replace('from_', '').replace('to_', '');
        }

        return filterIdClean;
    }

    /**
     * Remove item from active filter list.
     *
     * @param {string} target Remove Event or target string.
     */
    removeActiveFilter(target) {
        target = this.cleanFilterId(target);
        target = $('li[data-key="' + target + '"]', this.$activeFilterList);
        this.filterRecap.removeActiveFilter(target.get(0));
    }

    setTotalRows(totalRows) {
        this.totalRows = totalRows;
        const totalRowsEl = $('.filters-total-rows').first();
        totalRowsEl.find('.row-count').text(this.totalRows);
        totalRowsEl.attr('data-count', this.totalRows);
    }

    /**
     * Count all changed filters.
     *
     * @returns {int} Change count.
     */
    countChanges() {
        const changeCount = $('input.changed, select.changed', this.$form).length;
        const hasChanges = changeCount > 0;
        const changeCountString = hasChanges ? '(' + changeCount + ')' : '';

        // Disable buttons when there are no changes
        $('.js-filter-apply, .js-filter-reset, .js-filter-export', this.$form).prop('disabled', !hasChanges);

        // Set the label to singular/plural format
        $('.btn-label span.active', this.$applyBtn).removeClass('active');
        $('.btn-label span.active', this.$exportBtn).removeClass('active');
        $((changeCount === 1 ? '.btn-label-singular' : '.btn-label-plural'), this.$applyBtn).addClass('active');

        // Append change count to apply button
        $('.filter-apply-count', this.$applyBtn).text(changeCountString);

        // Add tab filter count to tab label
        $('.c-filter-group').each(function () {
            const tabChangeCount = $('input.changed, select.changed', this).length;
            const tabFilterCountEl = $('.c-filters-tab[data-tab="' + $(this).data('tab') + '"] .tab-filter-count');

            tabFilterCountEl.attr('data-count', tabChangeCount);
            tabFilterCountEl.find('.count').text(tabChangeCount);
        });

        return changeCount;
    }

    /**
     * Resets the filter widgets.
     *
     * @return this
     */
    clear() {
        // Reset form
        this.$form[0].reset();

        // Clear selects
        this.$form.find('select').each((index, item) => {
            $(item).val('');
            $(item).selectpicker('refresh');
        });

        // Clear date pickers
        $('.datetimepickerinput').datetimepicker('clear');
        // Set changed inputs to unchanged state
        $('input.changed, select.changed', this.$form).removeClass('changed');
        // Unrequire fields
        $('input, select', this.$form).prop('required', false);

        this.countChanges();

        // Clear active filter list
        $('li', this.$activeFilterList).remove();
        // Reset sort dropdown
        $(this.$sortBtn).removeClass('selected');

        this.submit();
        return this;
    }

    /**
     * Resets a filter.
     *
     * @param {string} filterId Filter ID.
     * @return this
     */
    clearFilter(listItem) {
        if (!$(listItem).length) {
            return;
        }

        const filterId = $(listItem).data('key');
        const listItemType = $(listItem).data('type');
        let filterInput, filterType;

        if (listItemType.includes('date')) {
            // Handle date pickers
            if (listItemType === 'date-range') {
                // Date Range
                filterType = 'date-range';
                filterInput = $('#from_' + filterId, this.$form);
            } else {
                // Single Date
                filterType = 'date';
                filterInput = $('#' + filterId, this.$form);
            }
        } else {
            // Handle all inputs
            filterInput = $('#' + filterId, this.$form);
            filterType = filterInput.length ? filterInput[0].type : 'unknown';
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
    }

    /**
     * Change the widget sorting order.
     *
     * @param {object} e Event.
     * @return this
     */
    sort(e) {
        const optionEl = $(e.target).closest('.dropdown-item');
        const label = $('.btn-label', optionEl).text();

        if ($(optionEl).hasClass('default')) {
            // Reset button to default sort
            $(this.$sortBtn).removeClass('selected');
        } else {
            // Perform sort
            $(this.$sortBtn).addClass('selected').data({
                property: optionEl.data('property'),
                direction: optionEl.data('direction')
            });
            $('.sort-option', this.$sortBtn).find('.sort-option-value').text(label);
        }

        this.submit();

        return this;
    }

    /**
     * Filter object definition.
     *
     * @param {object} name Input dom object.
     * @param {string} name Filter name.
     * @param {string} value Filter value.
     */
    filterObj(input, name, value) {
        const formField    = $(input).closest('.form-field');
        const dataOperator = formField.data('operator') || '';

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
            this.value = $(input).val();
            this.operator = "IN";
        }

        if (name.endsWith("[from]") || name.endsWith("[to]")) {
            this.type = 'daterange';
            this.operator = 'BETWEEN';
            this.matching = name.endsWith('[from]') ? name.replace('[from]', '[to]') : name.replace('[to]', '[from]');

            const matching_value = $('input[name="' + this.matching + '"]').val();

            if (!this.value.length || !matching_value.length) {
                if (!this.value.length) {
                    this.parseInvalidBetween(this.matching, matching_value);
                } else {
                    this.parseInvalidBetween(this.name, this.value);
                }
            }
        }
    }

    /**
     * Submit the filters to all widgets.
     *
     * @return this
     */
    submit() {
        let data, fields, filters = [], manager, widgets, request;
        const that = this;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data = this.$form.serializeArray();
            fields = this.$form.find(':input.changed');

            $.each(fields, function (i, field) {
                if (!!field.value) {
                    filters.push(new that.filterObj(field, field.name, field.value));
                }
            });

            this.clearOnEmpty = filters.length > 0;

            request = this.prepare_request(filters);

            widgets.forEach(function (widget) {
                this.dispatch(request, widget);
            }.bind(this));
        }

        return this;
    }

    export() {
        let data, fields, filters = [], manager, widgets, request;
        const that = this;

        manager = Charcoal.Admin.manager();
        widgets = manager.components.widgets;

        if (widgets.length > 0) {
            data = this.$form.serializeArray();
            fields = this.$form.find(':input.changed');

            $.each(fields, function (i, field) {
                if (!!field.value) {
                    filters.push(new that.filterObj(field, field.name, field.value));
                }
            });

            request = this.prepare_request(filters);
            widgets.forEach(function (widget) {
                if (typeof widget.set_filters !== 'function') {
                    return;
                }

                data = {
                    widget_type: widget.widget_type(),
                    widget_options: widget.widget_options(),
                    with_data: true
                };

                const filters = [];
                if (request.filters) {
                    filters.push(request.filters);
                }

                const orders = [];
                if (request.orders) {
                    orders.push(request.orders);
                }

                data.widget_options.collection_config.filters = filters || {};
                data.widget_options.collection_config.orders = orders || {};

            }.bind(this));

            const url = Charcoal.Admin.admin_url() + 'advanced-search/export' + window.location.search;

            $(this.$form).addClass('loading');

            this.reloadXHR = $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
            });

            let success, failure, complete;

            success = function (response) {
                if (typeof response.widget_id !== 'string') {
                    response.feedbacks.push({
                        level: 'error',
                        message: widgetL10n.loadingFailed
                    });

                    failure.call(this, response);
                    return;
                }

                const wid = response.widget_id;
                that.set_id(wid);
                that.add_opts('id', wid);
                that.add_opts('widget_id', wid);

                that.widget_id = wid;
                if (typeof response.file !== 'string') {
                    response.feedbacks.push({
                        level: 'error',
                        message: widgetL10n.loadingFailed
                    });
                    failure.call(this, response);
                    return;
                }

                window.location.href = Charcoal.Admin.admin_url() + 'advanced-search/download?filename=' + response.file;
            };

            failure = function (response) {
                if (response.feedbacks.length) {
                    Charcoal.Admin.feedback(response.feedbacks);
                } else {
                    Charcoal.Admin.feedback([{
                        level: 'error',
                        message: widgetL10n.loadingFailed
                    }]);
                }
            };

            complete = function () {
                if (!that.suppress_feedback()) {
                    Charcoal.Admin.feedback().dispatch();
                }
                $(that.$form).removeClass('loading');
            };

            Charcoal.Admin.resolveSimpleJsonXhr(
                this.reloadXHR,
                success,
                failure,
                complete
            );

        }

        return this;
    }

    /**
     * Prepares a search request from a query.
     *
     * @param  {array} query - The filters.
     * @return {object|null} A search request object or NULL.
     */
    prepare_request(p_filters) {
        let request            = null, filters = [], opts;
        const data             = this.opts('data');
        const orderProperty    = $(this.$sortBtn).data('property');
        const collection_table = this.opts('collection_table');

        p_filters.forEach(function (filter_obj) {
            const propName     = filter_obj.name.replace(/(\[.*)/gi, '');
            let filter_table   = null;
            let value_override = [];

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

                    const matching_value = $('input[name="' + filter_obj.matching + '"]').val();

                    if (filter_obj.name.endsWith('[from]')) {
                        value_override = [filter_obj.value, matching_value];
                    } else {
                        value_override = [matching_value, filter_obj.value];
                    }
                }
            }

            filters.push({
                conjunction: opts.conjunction || 'AND',
                table: filter_table,
                property: propName,
                value: value_override.length ? value_override : filter_obj.value,
                operator: filter_obj.operator
            });
        });

        request = {
            filters: null,
            orders: null,
        };

        if (filters.length) {
            request.filters = {
                filters: filters,
                table: collection_table
            };
        }

        if ($(this.$sortBtn).hasClass('selected') && orderProperty) {
            request.orders = {
                direction: $(this.$sortBtn).data('direction'),
                mode: $(this.$sortBtn).data('direction'),
                property: orderProperty
            };
        }

        return request;
    }

    /**
     * Dispatches the event to all widgets that can listen to it.
     *
     * @param  {object} request - The search request.
     * @param  {object} widget  - The widget to search on.
     * @return this
     */
    dispatch(request, widget) {
        if (this.isReloading || !widget || typeof widget.set_filters !== 'function') {
            return this;
        }

        if (typeof widget.pagination !== 'undefined') {
            widget.pagination.page = 1;
        }

        const filters = [];
        if (request.filters) {
            filters.push(request.filters);
        }

        widget.set_filters(filters);

        const orders = [];
        if (request.orders) {
            orders.push(request.orders);
        }

        $(this.$form).addClass('loading');
        this.isReloading = true;

        widget.set_orders(orders);

        // Support site search
        const site_search = this.opts('site_search');

        if (site_search.length > 0) {
            var search_widget = Charcoal.Admin.manager().get_widget(site_search);

            if (typeof widget.set_search_query === 'function') {
                search_widget.set_search_query(search_widget.$input.val());
                widget.set_search_query(search_widget.search_query());
            }

            if (typeof widget.set_filter === 'function') {
                widget.set_filter('search', search_widget.search_filters());
            }
        }

        // Reload the widget
        widget.reload(function (response) {
            if (response) {
                this.setTotalRows(response.widget_data.total_rows);
            }
            $(this.$form).removeClass('loading');
            this.isReloading = false;
        }.bind(this), true);

        return this;
    }
}

export default AdvancedSearch;