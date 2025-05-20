(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filterRecap = _interopRequireDefault(require("./filter-recap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _callSuper(_this, derived, args) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }

  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, isNativeReflectConstruct() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

let AdvancedSearch = /*#__PURE__*/function (_Charcoal$Admin$Widge) {
  function AdvancedSearch(opts) {
    var _this2;

    _classCallCheck(this, AdvancedSearch);

    if (!opts.data.properties_options) {
      opts.data.properties_options = {};
    }

    _this2 = _callSuper(this, AdvancedSearch, [opts]);
    Charcoal.Admin.Widget.call(_this2, opts);
    return _this2;
  }

  _inherits(AdvancedSearch, _Charcoal$Admin$Widge);

  return _createClass(AdvancedSearch, [{
    key: "init",
    value: function init() {
      this.$form = this.element();
      this.$applyBtn = $('.js-filter-apply', this.$form);
      this.$exportBtn = $('.js-filter-export', this.$form);
      this.$sortBtn = $('.sort-dropdown', this.$form);
      this.$activeFilterList = $('.active-filters', this.$form);
      this.totalRows = 0;
      this.isReloading = false;
      this.clearOnEmpty = false; // This is used to display the filters

      this.filterRecap = new _filterRecap.default(this.$form, this.$activeFilterList, this);
      this.$form.on('submit.charcoal.search.filter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.submit();
      }.bind(this));
      const that = this;
      this.$activeFilterList.on('click', '.js-remove-filter', function (e) {
        that.filterRecap.removeActiveFilter(e.target); // Clear everything if there are no more active filters.

        if (that.countChanges() === 0 && that.clearOnEmpty) {
          that.clear();
        }
      });
      this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this)); // Handle change sorting

      this.$form.on('click.charcoal.search.filter', '.sort-dropdown + .dropdown-menu>.dropdown-item', this.sort.bind(this));
      $('.c-filters-tab').on('click', function () {
        const tab_key = $(this).attr('data-tab'); // Activate tab button

        $('.c-filters-tab').removeClass('active');
        $('.c-filters-tab button i').addClass('fa-angle-down'); // Flip arrow

        $(this).addClass('active');
        $('button i', this).removeClass('fa-angle-down').addClass('fa-angle-up'); // Active tab field group

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
      this.$form.on('change', 'input, select', e => widget.onFieldChange(e));
      $('.datetimepickerinput', this.$form).on('change.datetimepicker', e => widget.onFieldChange(e));
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
  }, {
    key: "onFieldChange",
    value: function onFieldChange(e) {
      // Add item to active-filters list
      const widget = this;
      const targetFilter = e.target;
      let formField = $(targetFilter).attr('id');
      let filterVal = $(targetFilter).val();
      let filterName = $(targetFilter).attr('name');

      if (!filterName && typeof e.date === 'undefined') {
        // Date range filters don't have filtername and are yet valid filters
        // All other shall fail
        return;
      } // Checkboxes are different!


      if (e.target.type === 'checkbox') {
        filterVal = $(targetFilter).is(':checked') ? 'checked' : '';
      } // Date


      if (typeof e.date !== 'undefined') {
        const filterInput = $('input', targetFilter).first();
        const filterInputName = filterInput.attr('name');
        formField = filterInput.attr('id');

        if (filterInputName.endsWith("[to]") || filterInputName.endsWith("[from]")) {
          // Is a date range
          const primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
          const dates = [$('input[name="' + primaryName + '[from]"]').val() || null, $('input[name="' + primaryName + '[to]"]').val() || null].filter(function (element) {
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

      widget.filterRecap.refresh(); // Clear everything if there are no more active filters.

      if (widget.countChanges() === 0 && widget.clearOnEmpty) {
        widget.clear();
      }
    }
    /**
     * Count total active filters.
     *
     * @returns {int} Total active filters.
     */

  }, {
    key: "countActiveFilters",
    value: function countActiveFilters() {
      return $('li', this.$activeFilterList).length;
    }
    /**
     * Clean filter ID of 'from'/'to'.
     *
     * @param {string} filterId
     * @returns
     */

  }, {
    key: "cleanFilterId",
    value: function cleanFilterId(filterId) {
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

  }, {
    key: "removeActiveFilter",
    value: function removeActiveFilter(target) {
      if (typeof target === 'undefined') {
        this.filterRecap.removeActiveFilter();
        return;
      }

      target = this.cleanFilterId(target);
      target = $('li[data-key="' + target + '"]', this.$activeFilterList);
      this.filterRecap.removeActiveFilter(target.get(0));
    }
  }, {
    key: "setTotalRows",
    value: function setTotalRows(totalRows) {
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

  }, {
    key: "countChanges",
    value: function countChanges() {
      const changeCount = $('input.changed, select.changed', this.$form).length;
      const hasChanges = changeCount > 0;
      const changeCountString = hasChanges ? '(' + changeCount + ')' : ''; // Disable buttons when there are no changes

      $('.js-filter-apply, .js-filter-reset, .js-filter-export', this.$form).prop('disabled', !hasChanges); // Set the label to singular/plural format

      $('.btn-label span.active', this.$applyBtn).removeClass('active');
      $('.btn-label span.active', this.$exportBtn).removeClass('active');
      $(changeCount === 1 ? '.btn-label-singular' : '.btn-label-plural', this.$applyBtn).addClass('active'); // Append change count to apply button

      $('.filter-apply-count', this.$applyBtn).text(changeCountString); // Add tab filter count to tab label

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

  }, {
    key: "clear",
    value: function clear() {
      // Reset form
      this.removeActiveFilter(); // Clear selects

      this.$form.find('select').each((index, item) => {
        $(item).val('');
        $(item).selectpicker('deselectAll');
      }); // Clear date pickers

      $('.datetimepickerinput').each(function () {
        if ($('.datetimepicker-input', this).val().length) {
          $(this).datetimepicker('clear');
        }
      }); // Set changed inputs to unchanged state

      $('.changed', this.$form).removeClass('changed'); // Unrequire fields

      $('input, select', this.$form).prop('required', false);
      this.countChanges(); // Clear active filter list

      $('li', this.$activeFilterList).remove(); // Reset sort dropdown

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

  }, {
    key: "clearFilter",
    value: function clearFilter(listItem) {
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
      } // Reset respective input


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

  }, {
    key: "sort",
    value: function sort(e) {
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

  }, {
    key: "filterObj",
    value: function filterObj(input, name, value) {
      const formField = $(input).closest('.form-field');
      const dataOperator = formField.data('operator') || '';
      this.name = name;
      this.value = value;
      this.operator = '=';
      this.type = input.type;

      this.parseInvalidBetween = function (name, value) {
        this.type = 'date';
        this.value = value;
        this.operator = name.endsWith("[from]") ? '>' : '<';
      };

      if (dataOperator.length) {
        this.operator = dataOperator;
      } // text field


      if (this.type === 'text' && this.operator === 'LIKE') {
        this.value = '%' + this.value + '%';
      } // switch checkbox


      if (this.type === 'checkbox') {
        this.value = input.checked;
      }

      if (this.type === 'select-multiple') {
        this.value = $(input).val();

        if (this.operator !== 'FIND_IN_SET') {
          this.operator = "IN";
        }
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

  }, {
    key: "submit",
    value: function submit() {
      let data,
          fields,
          filters = [],
          manager,
          widgets,
          request;
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
  }, {
    key: "export",
    value: function _export() {
      let data,
          fields,
          filters = [],
          manager,
          widgets,
          request;
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
          contentType: 'application/json'
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

        Charcoal.Admin.resolveSimpleJsonXhr(this.reloadXHR, success, failure, complete);
      }

      return this;
    }
    /**
     * Prepares a search request from a query.
     *
     * @param  {array} query - The filters.
     * @return {object|null} A search request object or NULL.
     */

  }, {
    key: "prepare_request",
    value: function prepare_request(p_filters) {
      let request = null,
          filters = [],
          opts;
      const data = this.opts('data');
      const orderProperty = $(this.$sortBtn).data('property');
      const collection_table = this.opts('collection_table');
      p_filters.forEach(function (filter_obj) {
        const propName = filter_obj.name.replace(/(\[.*)/gi, '');
        let filter_table = null;
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
        orders: null
      };

      if (filters.length) {
        request.filters = {
          filters: filters,
          name: 'advanced-search',
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

  }, {
    key: "dispatch",
    value: function dispatch(request, widget) {
      if (this.isReloading || !widget || typeof widget.set_filters !== 'function') {
        return this;
      }

      if (typeof widget.pagination !== 'undefined') {
        widget.pagination.page = 1;
      } // Initialize filters array


      const filters = []; // Add isAdvancedSearch dummy filter.
      // This can be used to detect if a table widget was loaded using Advanced Search

      filters.push({
        conjunction: 'AND',
        name: 'isAdvancedSearch',
        condition: '(1 = 1)'
      });

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
      widget.set_orders(orders); // Support site search

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
      } // Reload the widget


      widget.reload(function (response) {
        if (response) {
          this.setTotalRows(response.widget_data.total_rows);
        }

        $(this.$form).removeClass('loading');
        this.isReloading = false;
      }.bind(this), true);
      return this;
    }
  }]);
}(Charcoal.Admin.Widget);

var _default = exports.default = AdvancedSearch;

},{"./filter-recap":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

let AdvancedSearchFilterRecap = /*#__PURE__*/function () {
  function AdvancedSearchFilterRecap($form, $activeFilterList, parent) {
    _classCallCheck(this, AdvancedSearchFilterRecap);

    this.$form = $form;
    this.$activeFilterList = $activeFilterList;
    this.filterObject = undefined;
    this.parent = parent;
  }
  /**
   * Event
   * Call when anything changes in the filter area
   */


  return _createClass(AdvancedSearchFilterRecap, [{
    key: "refresh",
    value: function refresh() {
      this.buildFilterObjectFromInputs();
      this.displayFilters();
    }
    /**
     * Fetch all inputs and build a json usable to display filters
     *
     * @param $container
     */

  }, {
    key: "buildFilterObjectFromInputs",
    value: function buildFilterObjectFromInputs() {
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
          formFieldIds.push(value.id); // Populate output

          output.push(value);
        }
      });
      this.filterObject = output;
    }
  }, {
    key: "extractLabelAndValueFromInput",
    value: function extractLabelAndValueFromInput(domElement) {
      let tmp = null; // Base values

      const $domElement = $(domElement);
      let formField = $domElement.attr('id');
      let filterVal = $domElement.val();
      let filterType = 'input'; // Filter name from label

      const filterWrapper = $domElement.closest('fieldset');
      const filterName = $('label', filterWrapper).first().text();
      const inputName = $domElement.attr('name');

      if (typeof inputName === 'undefined') {
        return false;
      } // Datetime range


      if (inputName.endsWith("[to]") || inputName.endsWith("[from]")) {
        // The formField id will be used to prevent having twice the safe filter displayed in the list
        // Since the from and to inputs have the same ID except for that prefix
        formField = formField.replace('from_', '').replace('to_', '');
        tmp = this.extractFromDateRange(domElement);
      } // Select


      if (domElement.tagName === 'SELECT') {
        tmp = this.extractFromSelect(domElement);
      } // Checkbox


      if (domElement.type === 'checkbox') {
        tmp = this.extractFromCheckbox(domElement);
      } // Override values


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

  }, {
    key: "extractFromDateRange",
    value: function extractFromDateRange(domElement) {
      const filterInput = $(domElement);
      const filterInputName = filterInput.attr('name'); // Is a date range

      const filterType = 'date-range';
      const primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
      const dates = [$('input[name="' + primaryName + '[from]"]').val() || null, $('input[name="' + primaryName + '[to]"]').val() || null].filter(function (element) {
        return element !== null;
      });
      const filterVal = dates.join(' - ');
      return {
        type: filterType,
        val: filterVal
      };
    }
  }, {
    key: "extractFromSelect",
    value: function extractFromSelect(domElement) {
      const filterType = 'select';
      const filterVal = Array.from(domElement.selectedOptions).map(function (option) {
        return option.value ? option.innerHTML : null;
      }).filter(function (element) {
        return element !== null;
      }).join(', ');
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

  }, {
    key: "extractFromCheckbox",
    value: function extractFromCheckbox(domElement) {
      const filterVal = $(domElement).is(':checked') ? $('html').attr('lang') === 'fr' ? 'Oui' : 'Yes' : '';
      return {
        type: 'checkbox',
        val: filterVal
      };
    }
    /**
     * Display filters labels from the json
     */

  }, {
    key: "displayFilters",
    value: function displayFilters() {
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

  }, {
    key: "addActiveFilter",
    value: function addActiveFilter(opts) {
      const id = opts.id;
      const type = opts.type;
      const label = opts.name;
      const value = opts.val;
      const listItem = $('<li></li>').append($('<span></span>').addClass('label').text(label).attr('title', label)).append($('<span></span>').addClass('value').text(value).attr('title', value)).append($('<div></div>').addClass('remove fa fa-times js-remove-filter')).attr('data-key', id).attr('data-type', type);
      $(this.$activeFilterList).append(listItem);
    }
    /**
     * Remove item from active filter list.
     *
     * @param {Element|string} domElement Remove Event or target string.
     */

  }, {
    key: "removeActiveFilter",
    value: function removeActiveFilter(domElement) {
      var filter_recap = this; // Remove all filters if domElement is undefined.

      if (typeof domElement === 'undefined') {
        $('li', filter_recap.$activeFilterList).each(function () {
          filter_recap.removeListItem(this);
        });
        return;
      } // Remove domElement from the active filter list.


      filter_recap.removeListItem(domElement);
    }
  }, {
    key: "removeListItem",
    value: function removeListItem(domElement) {
      // Remove domElement from the active filter list.
      const listItem = $(domElement).closest('li');

      if (listItem.length) {
        this.parent.clearFilter(listItem);
        listItem.remove();
      }
    }
  }]);
}();

var _default = exports.default = AdvancedSearchFilterRecap;

},{}],3:[function(require,module,exports){
"use strict";

var _advancedSearch = _interopRequireDefault(require("./advanced-search"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Charcoal */
;

(function () {
  Charcoal.Admin.Widget_Advanced_Search = _advancedSearch.default;
  Charcoal.Admin.Widget_Advanced_Search_Tabs = _advancedSearch.default;
})(jQuery);

},{"./advanced-search":1}]},{},[3]);
