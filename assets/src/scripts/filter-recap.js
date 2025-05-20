class AdvancedSearchFilterRecap {
    constructor($form, $activeFilterList, parent) {
        this.$form = $form;
        this.$activeFilterList = $activeFilterList;
        this.filterObject = undefined;
        this.parent = parent;
    }

    /**
     * Event
     * Call when anything changes in the filter area
     */
    refresh() {
        this.buildFilterObjectFromInputs();
        this.displayFilters();
    }

    /**
     * Fetch all inputs and build a json usable to display filters
     *
     * @param $container
     */
    buildFilterObjectFromInputs() {
        const output = [];
        const that = this;
        const formFieldIds = [];

        $('input, select', this.$form).each(function (i, current) {
            // Skip unfilled filters
            // @todo Add more context than only !current.value
            if (!current.value) {
                return true;
            }

            if (current.type === 'checkbox' && !$(current).is(':checked')) {
                return true;
            }

            const value = that.extractLabelAndValueFromInput(current);

            if (!value) {
                return;
            }

            if (!formFieldIds.includes(value.id)) {
                formFieldIds.push(value.id);
                // Populate output
                output.push(value);
            }
        });

        this.filterObject = output;
    }

    extractLabelAndValueFromInput(domElement) {
        let tmp = null;

        // Base values
        const $domElement = $(domElement);
        let formField = $domElement.attr('id');
        let filterVal = $domElement.val();
        let filterType = 'input';

        // Filter name from label
        const filterWrapper = $domElement.closest('fieldset');
        const filterName = $('label', filterWrapper).first().text();

        const inputName = $domElement.attr('name');

        if (typeof inputName === 'undefined') {
            return false;
        }

        // Datetime range
        if (inputName.endsWith("[to]") || inputName.endsWith("[from]")) {
            // The formField id will be used to prevent having twice the safe filter displayed in the list
            // Since the from and to inputs have the same ID except for that prefix
            formField = formField.replace('from_', '').replace('to_', '');
            tmp = this.extractFromDateRange(domElement);
        }

        // Select
        if (domElement.tagName === 'SELECT') {
            tmp = this.extractFromSelect(domElement);
        }

        // Checkbox
        if (domElement.type === 'checkbox') {
            tmp = this.extractFromCheckbox(domElement);
        }

        // Override values
        if (tmp !== null && tmp) {
            filterType = tmp.type;
            filterVal = tmp.val;
        }

        return {
            id: formField,
            type: filterType,
            val: filterVal,
            name: filterName
        };
    }

    /**
     *
     * @param $input
     * @returns {{val: string, type: string}}
     */
    extractFromDateRange(domElement) {
        const filterInput = $(domElement);
        const filterInputName = filterInput.attr('name');

        // Is a date range
        const filterType = 'date-range';
        const primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
        const dates = [
            $('input[name="' + primaryName + '[from]"]').val() || null,
            $('input[name="' + primaryName + '[to]"]').val() || null
        ].filter(function (element) {
            return element !== null;
        });

        const filterVal = dates.join(' - ');

        return {
            type: filterType,
            val: filterVal
        };
    }

    extractFromSelect(domElement) {
        const filterType = 'select';
        const filterVal = Array.from(domElement.selectedOptions).map(function (option) {
            return option.value ? option.innerHTML : null;
        })
            .filter(function (element) {
                return element !== null;
            })
            .join(', ');

        return {
            type: filterType,
            val: filterVal
        };
    }

    /**
     * Weird, it should definitly be Yes at all time at this point
     *
     * @param domElement
     * @returns {{val: (string), type: string}}
     */
    extractFromCheckbox(domElement) {
        const filterVal = $(domElement).is(':checked') ? ($('html').attr('lang') === 'fr' ? 'Oui' : 'Yes') : '';

        return {
            type: 'checkbox',
            val: filterVal
        };
    }

    /**
     * Display filters labels from the json
     */
    displayFilters() {
        if (this.filterObject === undefined) {
            return;
        }
        this.$activeFilterList.empty();

        for (const i in this.filterObject) {
            const currentFilter = this.filterObject[i];
            this.addActiveFilter(currentFilter);
        }
    }

    /**
     * Add Active Filter.
     *
     * @param {object} opts
     * @param {string} opts.id
     * @param {string} opts.type
     * @param {string} opts.label
     * @param {string} opts.val
     */
    addActiveFilter(opts) {
        const id = opts.id;
        const type = opts.type;
        const label = opts.name;
        const value = opts.val;

        const listItem = $('<li></li>')
            .append($('<span></span>').addClass('label').text(label).attr('title', label))
            .append($('<span></span>').addClass('value').text(value).attr('title', value))
            .append($('<div></div>').addClass('remove fa fa-times js-remove-filter'))
            .attr('data-key', id)
            .attr('data-type', type);
        $(this.$activeFilterList).append(listItem);
    }

    /**
     * Remove item from active filter list.
     *
     * @param {Element|string} domElement Remove Event or target string.
     */
    removeActiveFilter(domElement) {
        var filter_recap = this;

        // Remove all filters if domElement is undefined.
        if (typeof domElement === 'undefined') {
            $('li', filter_recap.$activeFilterList).each(function() {
                filter_recap.removeListItem(this);
            });
            return;
        }

        // Remove domElement from the active filter list.
        filter_recap.removeListItem(domElement);
    }

    removeListItem(domElement) {
        // Remove domElement from the active filter list.
        const listItem = $(domElement).closest('li');

        if (listItem.length) {
            this.parent.clearFilter(listItem);
            listItem.remove();
        }
    }
}

export default AdvancedSearchFilterRecap;
