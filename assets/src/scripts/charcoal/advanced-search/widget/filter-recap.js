var AdvancedSearchFilterRecap = function ($form, $activeFilterList, parent) {
    this.$form             = $form;
    this.$activeFilterList = $activeFilterList;
    this.filterObject      = undefined;
    this.parent            = parent;
};

/**
 * Event
 * Call when anything changes in the filter area
 */
AdvancedSearchFilterRecap.prototype.refresh = function () {
    this.buildFilterObjectFromInputs();
    this.displayFilters();
};

/**
 * Fetch all inputs and build a json usable to display filters
 *
 * @param $container
 */
AdvancedSearchFilterRecap.prototype.buildFilterObjectFromInputs = function () {
    var output = [];
    var that   = this;

    $('input, select', this.$form).each(function (i, current) {
        // Skip unfilled filters
        // @todo Add more context than only !current.value
        if (!current.value) {
            return true;
        }

        if (current.type === 'checkbox' && !$(current).is(':checked')) {
            return true;
        }

        // Populate output
        output.push(that.extractLabelAndValueFromInput(current));
    });

    this.filterObject = output;
};

AdvancedSearchFilterRecap.prototype.extractLabelAndValueFromInput = function (domElement) {
    var tmp    = null;

    // Base values
    var $domElement = $(domElement);
    var formField   = $domElement.attr('id');
    var filterVal   = $domElement.val();
    var filterType  = 'input';

    // Filter name from label
    var filterWrapper = $domElement.closest('fieldset');
    var filterName    = $('label', filterWrapper).first().text();

    var inputName = $domElement.attr('name');

    // Most certainly a datetime range
    if (inputName.endsWith("[to]") || inputName.endsWith("[from]")) {
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

    // OVerride values
    if (tmp !== null && tmp) {
        filterType = tmp.type;
        filterVal  = tmp.val;
    }

    return {
        id:   formField,
        type: filterType,
        val:  filterVal,
        name: filterName
    };
};

/**
 *
 * @param $input
 * @returns {{val: string, type: string}}
 */
AdvancedSearchFilterRecap.prototype.extractFromDateRange = function (domElement) {
    var filterInput         = $('input', domElement).first();
    var filterInputName     = filterInput.attr('name');

    // Is a date range
    var filterType  = 'date-range';
    var primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
    var dates       = [
        $('input[name="' + primaryName + '[from]"]').val() || null,
        $('input[name="' + primaryName + '[to]"]').val() || null
    ].filter(function (element) {
        return element !== null;
    });

    var filterVal = dates.join(' - ');

    return {
        type: filterType,
        val:  filterVal
    };
};

AdvancedSearchFilterRecap.prototype.extractFromSelect = function (domElement) {
    var filterType = 'select';
    var filterVal  = Array.from(domElement.selectedOptions).map(function (option) {
                              return option.value ? option.innerHTML : null;
                          })
                          .filter(function (element) {
                              return element !== null;
                          })
                          .join(', ');

    return {
        type: filterType,
        val:  filterVal
    };
};

/**
 * Weird, it should definitly be Yes at all time at this point
 *
 * @param domElement
 * @returns {{val: (string), type: string}}
 */
AdvancedSearchFilterRecap.prototype.extractFromCheckbox = function (domElement) {
    var filterVal = $(domElement).is(':checked') ? ($('html').attr('lang') === 'fr' ? 'Oui' : 'Yes') : '';

    return {
        type: 'checkbox',
        val:  filterVal
    };
};

/**
 * Display filters labels from the json
 */
AdvancedSearchFilterRecap.prototype.displayFilters = function () {
    if (this.filterObject === undefined) {
        return;
    }
    this.$activeFilterList.empty();

    for (var i in this.filterObject) {
        var currentFilter = this.filterObject[i];
        this.addActiveFilter(currentFilter);
    }
};

/**
 * Add Active Filter.
 *
 * @param opts { id: id, type: type, label: label, val: val }
 */
AdvancedSearchFilterRecap.prototype.addActiveFilter = function (opts) {
    var id    = opts.id;
    var type  = opts.type;
    var label = opts.name;
    var value = opts.val;

    var listItem = $('<li></li>')
        .append($('<span></span>').addClass('label').text(label).attr('title', label))
        .append($('<span></span>').addClass('value').text(value).attr('title', value))
        .append($('<div></div>').addClass('remove fa fa-times js-remove-filter'))
        .attr('data-key', id)
        .attr('data-type', type);
    $(this.$activeFilterList).append(listItem);
};


/**
 * Remove item from active filter list.
 *
 * @param {event|string} e Remove Event or target string.
 */
AdvancedSearchFilterRecap.prototype.removeActiveFilter = function (domElement) {
    var listItem = $(domElement).closest('li');

    if (listItem.length) {
        this.parent.clearFilter(listItem);
        listItem.remove();
    }
};
