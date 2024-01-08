(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _filterRecap = _interopRequireDefault(require("./filter-recap"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); } /* global Charcoal */
var widgetL10n = window.widgetL10n || {};
var $ = jQuery;

/**
 * Advanced search widget used for filtering a list
 * `charcoal/advanced-search/widget/advanced-search`
 *
 * Require:
 * - jQuery
 *
 * @param  {Object}  opts Options for widget
 */
var AdvancedSearch = /*#__PURE__*/function (_Charcoal$Admin$Widge) {
  _inherits(AdvancedSearch, _Charcoal$Admin$Widge);
  var _super = _createSuper(AdvancedSearch);
  function AdvancedSearch(opts) {
    var _this;
    _classCallCheck(this, AdvancedSearch);
    if (!opts.data.properties_options) {
      opts.data.properties_options = {};
    }
    _this = _super.call(this, opts);
    Charcoal.Admin.Widget.call(_assertThisInitialized(_this), opts);
    return _this;
  }
  _createClass(AdvancedSearch, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.$form = this.element();
      this.$applyBtn = $('.js-filter-apply', this.$form);
      this.$exportBtn = $('.js-filter-export', this.$form);
      this.$sortBtn = $('.sort-dropdown', this.$form);
      this.$activeFilterList = $('.active-filters', this.$form);
      this.totalRows = 0;
      this.isReloading = false;
      this.clearOnEmpty = false;

      // This is used to display the filters
      this.filterRecap = new _filterRecap["default"](this.$form, this.$activeFilterList, this);
      this.$form.on('submit.charcoal.search.filter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.submit();
      }.bind(this));
      var that = this;
      this.$activeFilterList.on('click', '.js-remove-filter', function (e) {
        that.filterRecap.removeActiveFilter(e.target);

        // Clear everything if there are no more active filters.
        if (that.countChanges() === 0 && that.clearOnEmpty) {
          that.clear();
        }
      });
      this.$form.on('click.charcoal.search.filter', '.js-filter-reset', this.clear.bind(this));

      // Handle change sorting
      this.$form.on('click.charcoal.search.filter', '.sort-dropdown + .dropdown-menu>.dropdown-item', this.sort.bind(this));
      $('.c-filters-tab').on('click', function () {
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
      $(this.$exportBtn).on('click', function () {
        widget["export"]();
        return false;
      });
      $('input, select', this.$form).on('change', function (e) {
        return widget.onFieldChange(e);
      });
      $('.datetimepickerinput', this.$form).on('change.datetimepicker', function (e) {
        return widget.onFieldChange(e);
      });
      $($('input:not([type=hidden]), select:not([type=hidden])', this.$form)[0]).trigger('change');
      if (this.countActiveFilters() > 0) {
        this.clearOnEmpty = true;
        var manager = Charcoal.Admin.manager();
        manager.ready(function () {
          var widgets = manager.components.widgets;
          if (widgets.length > 0) {
            widgets.forEach(function (widget) {
              var _widget$opts$total_ro;
              if (!widget || typeof widget.set_filters !== 'function') {
                return this;
              }
              var total_rows = (_widget$opts$total_ro = widget.opts('data').total_rows) !== null && _widget$opts$total_ro !== void 0 ? _widget$opts$total_ro : null;
              if (total_rows !== null) {
                this.setTotalRows(total_rows);
              }
            }.bind(_this2));
          }
        });
      }
    }
  }, {
    key: "onFieldChange",
    value: function onFieldChange(e) {
      // Add item to active-filters list
      var widget = this;
      var targetFilter = e.target;
      var formField = $(targetFilter).attr('id');
      var filterVal = $(targetFilter).val();

      // Checkboxes are different!
      if (e.target.type === 'checkbox') {
        filterVal = $(targetFilter).is(':checked') ? 'checked' : '';
      }

      // Date
      if (typeof e.date !== 'undefined') {
        var filterInput = $('input', targetFilter).first();
        var filterInputName = filterInput.attr('name');
        formField = filterInput.attr('id');
        if (filterInputName.endsWith("[to]") || filterInputName.endsWith("[from]")) {
          // Is a date range
          var primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
          var dates = [$('input[name="' + primaryName + '[from]"]').val() || null, $('input[name="' + primaryName + '[to]"]').val() || null].filter(function (element) {
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
      // Clear everything if there are no more active filters.
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
      var filterIdClean = filterId;
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
      var totalRowsEl = $('.filters-total-rows').first();
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
      var changeCount = $('input.changed, select.changed', this.$form).length;
      var hasChanges = changeCount > 0;
      var changeCountString = hasChanges ? '(' + changeCount + ')' : '';

      // Disable buttons when there are no changes
      $('.js-filter-apply, .js-filter-reset, .js-filter-export', this.$form).prop('disabled', !hasChanges);

      // Set the label to singular/plural format
      $('.btn-label span.active', this.$applyBtn).removeClass('active');
      $('.btn-label span.active', this.$exportBtn).removeClass('active');
      $(changeCount === 1 ? '.btn-label-singular' : '.btn-label-plural', this.$applyBtn).addClass('active');

      // Append change count to apply button
      $('.filter-apply-count', this.$applyBtn).text(changeCountString);

      // Add tab filter count to tab label
      $('.c-filter-group').each(function () {
        var tabChangeCount = $('input.changed, select.changed', this).length;
        var tabFilterCountEl = $('.c-filters-tab[data-tab="' + $(this).data('tab') + '"] .tab-filter-count');
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
      this.removeActiveFilter();

      // Clear selects
      this.$form.find('select').each(function (index, item) {
        $(item).val('');
        $(item).selectpicker('deselectAll');
      });

      // Clear date pickers
      $('.datetimepickerinput').each(function () {
        if ($('.datetimepicker-input', this).val().length) {
          $(this).datetimepicker('clear');
        }
      });
      // Set changed inputs to unchanged state
      $('.changed', this.$form).removeClass('changed');
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
  }, {
    key: "clearFilter",
    value: function clearFilter(listItem) {
      if (!$(listItem).length) {
        return;
      }
      var filterId = $(listItem).data('key');
      var listItemType = $(listItem).data('type');
      var filterInput, filterType;
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
  }, {
    key: "sort",
    value: function sort(e) {
      var optionEl = $(e.target).closest('.dropdown-item');
      var label = $('.btn-label', optionEl).text();
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
      var formField = $(input).closest('.form-field');
      var dataOperator = formField.data('operator') || '';
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
        var matching_value = $('input[name="' + this.matching + '"]').val();
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
      var data,
        fields,
        filters = [],
        manager,
        widgets,
        request;
      var that = this;
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
      var data,
        fields,
        filters = [],
        manager,
        widgets,
        request;
      var that = this;
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
          var filters = [];
          if (request.filters) {
            filters.push(request.filters);
          }
          var orders = [];
          if (request.orders) {
            orders.push(request.orders);
          }
          data.widget_options.collection_config.filters = filters || {};
          data.widget_options.collection_config.orders = orders || {};
        }.bind(this));
        var url = Charcoal.Admin.admin_url() + 'advanced-search/export' + window.location.search;
        $(this.$form).addClass('loading');
        this.reloadXHR = $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(data),
          dataType: 'json',
          contentType: 'application/json'
        });
        var success, failure, complete;
        success = function success(response) {
          if (typeof response.widget_id !== 'string') {
            response.feedbacks.push({
              level: 'error',
              message: widgetL10n.loadingFailed
            });
            failure.call(this, response);
            return;
          }
          var wid = response.widget_id;
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
        failure = function failure(response) {
          if (response.feedbacks.length) {
            Charcoal.Admin.feedback(response.feedbacks);
          } else {
            Charcoal.Admin.feedback([{
              level: 'error',
              message: widgetL10n.loadingFailed
            }]);
          }
        };
        complete = function complete() {
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
      var request = null,
        filters = [],
        opts;
      var data = this.opts('data');
      var orderProperty = $(this.$sortBtn).data('property');
      var collection_table = this.opts('collection_table');
      p_filters.forEach(function (filter_obj) {
        var propName = filter_obj.name.replace(/(\[.*)/gi, '');
        var filter_table = null;
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
            var matching_value = $('input[name="' + filter_obj.matching + '"]').val();
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
      }

      // Initialize filters array
      var filters = [];

      // Add isAdvancedSearch dummy filter.
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
      var orders = [];
      if (request.orders) {
        orders.push(request.orders);
      }
      $(this.$form).addClass('loading');
      this.isReloading = true;
      widget.set_orders(orders);

      // Support site search
      var site_search = this.opts('site_search');
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
  }]);
  return AdvancedSearch;
}(Charcoal.Admin.Widget);
var _default = AdvancedSearch;
exports["default"] = _default;

},{"./filter-recap":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var AdvancedSearchFilterRecap = /*#__PURE__*/function () {
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
  _createClass(AdvancedSearchFilterRecap, [{
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
      var output = [];
      var that = this;
      var formFieldIds = [];
      $('input, select', this.$form).each(function (i, current) {
        // Skip unfilled filters
        // @todo Add more context than only !current.value
        if (!current.value) {
          return true;
        }
        if (current.type === 'checkbox' && !$(current).is(':checked')) {
          return true;
        }
        var value = that.extractLabelAndValueFromInput(current);
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
  }, {
    key: "extractLabelAndValueFromInput",
    value: function extractLabelAndValueFromInput(domElement) {
      var tmp = null;

      // Base values
      var $domElement = $(domElement);
      var formField = $domElement.attr('id');
      var filterVal = $domElement.val();
      var filterType = 'input';

      // Filter name from label
      var filterWrapper = $domElement.closest('fieldset');
      var filterName = $('label', filterWrapper).first().text();
      var inputName = $domElement.attr('name');
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
  }, {
    key: "extractFromDateRange",
    value: function extractFromDateRange(domElement) {
      var filterInput = $(domElement);
      var filterInputName = filterInput.attr('name');

      // Is a date range
      var filterType = 'date-range';
      var primaryName = filterInputName.replace('[from]', '').replace('[to]', '');
      var dates = [$('input[name="' + primaryName + '[from]"]').val() || null, $('input[name="' + primaryName + '[to]"]').val() || null].filter(function (element) {
        return element !== null;
      });
      var filterVal = dates.join(' - ');
      return {
        type: filterType,
        val: filterVal
      };
    }
  }, {
    key: "extractFromSelect",
    value: function extractFromSelect(domElement) {
      var filterType = 'select';
      var filterVal = Array.from(domElement.selectedOptions).map(function (option) {
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
      var filterVal = $(domElement).is(':checked') ? $('html').attr('lang') === 'fr' ? 'Oui' : 'Yes' : '';
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
      for (var i in this.filterObject) {
        var currentFilter = this.filterObject[i];
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
      var id = opts.id;
      var type = opts.type;
      var label = opts.name;
      var value = opts.val;
      var listItem = $('<li></li>').append($('<span></span>').addClass('label').text(label).attr('title', label)).append($('<span></span>').addClass('value').text(value).attr('title', value)).append($('<div></div>').addClass('remove fa fa-times js-remove-filter')).attr('data-key', id).attr('data-type', type);
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
      var filter_recap = this;

      // Remove all filters if domElement is undefined.
      if (typeof domElement === 'undefined') {
        $('li', filter_recap.$activeFilterList).each(function () {
          filter_recap.removeListItem(this);
        });
        return;
      }

      // Remove domElement from the active filter list.
      filter_recap.removeListItem(domElement);
    }
  }, {
    key: "removeListItem",
    value: function removeListItem(domElement) {
      // Remove domElement from the active filter list.
      var listItem = $(domElement).closest('li');
      if (listItem.length) {
        this.parent.clearFilter(listItem);
        listItem.remove();
      }
    }
  }]);
  return AdvancedSearchFilterRecap;
}();
var _default = AdvancedSearchFilterRecap;
exports["default"] = _default;

},{}],3:[function(require,module,exports){
"use strict";

var _advancedSearch = _interopRequireDefault(require("./advanced-search"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* global Charcoal */

;
(function () {
  Charcoal.Admin.Widget_Advanced_Search = _advancedSearch["default"];
  Charcoal.Admin.Widget_Advanced_Search_Tabs = _advancedSearch["default"];
})(jQuery);

},{"./advanced-search":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc3JjL3NjcmlwdHMvYWR2YW5jZWQtc2VhcmNoLmpzIiwiYXNzZXRzL3NyYy9zY3JpcHRzL2ZpbHRlci1yZWNhcC5qcyIsImFzc2V0cy9zcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQSxJQUFBLFlBQUEsR0FBQSxzQkFBQSxDQUFBLE9BQUE7QUFBdUQsU0FBQSx1QkFBQSxHQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsQ0FBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxHQUFBO0FBQUEsU0FBQSxnQkFBQSxRQUFBLEVBQUEsV0FBQSxVQUFBLFFBQUEsWUFBQSxXQUFBLGVBQUEsU0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsRUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxXQUFBLGlCQUFBLFFBQUEsbUJBQUEsV0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLFFBQUEsR0FBQSxHQUFBLFlBQUEsQ0FBQSxHQUFBLG9CQUFBLE9BQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQTtBQUFBLFNBQUEsYUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLE9BQUEsQ0FBQSxLQUFBLGtCQUFBLEtBQUEsa0JBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsT0FBQSxJQUFBLEtBQUEsU0FBQSxRQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsRUFBQSxJQUFBLG9CQUFBLE9BQUEsQ0FBQSxHQUFBLHVCQUFBLEdBQUEsWUFBQSxTQUFBLDREQUFBLElBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxLQUFBO0FBQUEsU0FBQSxVQUFBLFFBQUEsRUFBQSxVQUFBLGVBQUEsVUFBQSxtQkFBQSxVQUFBLHVCQUFBLFNBQUEsMERBQUEsUUFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsSUFBQSxVQUFBLENBQUEsU0FBQSxJQUFBLFdBQUEsSUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsUUFBQSxZQUFBLGFBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBLGlCQUFBLFFBQUEsZ0JBQUEsVUFBQSxFQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQUEsVUFBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxlQUFBLENBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxTQUFBLGFBQUEsT0FBQSxRQUFBLHlCQUFBLEdBQUEseUJBQUEsb0JBQUEscUJBQUEsUUFBQSxLQUFBLEdBQUEsZUFBQSxDQUFBLE9BQUEsR0FBQSxNQUFBLE1BQUEseUJBQUEsUUFBQSxTQUFBLEdBQUEsZUFBQSxPQUFBLFdBQUEsRUFBQSxNQUFBLEdB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QUEsS0FBQSxFQUVELFNBQUEsZUFBZSxVQUFVLEVBQUU7TUFDdkI7TUFDQSxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztNQUU1QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNyQjtJQUNKO0VBQUM7RUFBQSxPQUFBLHlCQUFBO0FBQUE7QUFBQSxJQUFBLFFBQUEsR0FHVSx5QkFBeUI7QUFBQSxPQUFBLGNBQUEsUUFBQTs7Ozs7QUN4T3hDLElBQUEsZUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUErQyxTQUFBLHVCQUFBLEdBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxDQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLEdBQUE7QUFEL0M7O0FBR0E7QUFBRSxhQUFZO0VBQ1YsUUFBUSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBUSwwQkFBYztFQUMzRCxRQUFRLENBQUMsS0FBSyxDQUFDLDJCQUEyQixHQUFHLDBCQUFjO0FBQy9ELENBQUMsRUFBQyxNQUFNLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWwgQ2hhcmNvYWwgKi9cbmltcG9ydCBBZHZhbmNlZFNlYXJjaEZpbHRlclJlY2FwIGZyb20gXCIuL2ZpbHRlci1yZWNhcFwiO1xuXG5jb25zdCB3aWRnZXRMMTBuID0gd2luZG93LndpZGdldEwxMG4gfHwge307XG5jb25zdCAkID0galF1ZXJ5O1xuXG4vKipcbiAqIEFkdmFuY2VkIHNlYXJjaCB3aWRnZXQgdXNlZCBmb3IgZmlsdGVyaW5nIGEgbGlzdFxuICogYGNoYXJjb2FsL2FkdmFuY2VkLXNlYXJjaC93aWRnZXQvYWR2YW5jZWQtc2VhcmNoYFxuICpcbiAqIFJlcXVpcmU6XG4gKiAtIGpRdWVyeVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gIG9wdHMgT3B0aW9ucyBmb3Igd2lkZ2V0XG4gKi9cbmNsYXNzIEFkdmFuY2VkU2VhcmNoIGV4dGVuZHMgQ2hhcmNvYWwuQWRtaW4uV2lkZ2V0IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgaWYgKCFvcHRzLmRhdGEucHJvcGVydGllc19vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRzLmRhdGEucHJvcGVydGllc19vcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIENoYXJjb2FsLkFkbWluLldpZGdldC5jYWxsKHRoaXMsIG9wdHMpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuJGZvcm0gICAgICAgICAgICAgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy4kYXBwbHlCdG4gICAgICAgICA9ICQoJy5qcy1maWx0ZXItYXBwbHknLCB0aGlzLiRmb3JtKTtcbiAgICAgICAgdGhpcy4kZXhwb3J0QnRuICAgICAgICA9ICQoJy5qcy1maWx0ZXItZXhwb3J0JywgdGhpcy4kZm9ybSk7XG4gICAgICAgIHRoaXMuJHNvcnRCdG4gICAgICAgICAgPSAkKCcuc29ydC1kcm9wZG93bicsIHRoaXMuJGZvcm0pO1xuICAgICAgICB0aGlzLiRhY3RpdmVGaWx0ZXJMaXN0ID0gJCgnLmFjdGl2ZS1maWx0ZXJzJywgdGhpcy4kZm9ybSk7XG4gICAgICAgIHRoaXMudG90YWxSb3dzICAgICAgICAgPSAwO1xuICAgICAgICB0aGlzLmlzUmVsb2FkaW5nICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xlYXJPbkVtcHR5ICAgICAgPSBmYWxzZTtcblxuICAgICAgICAvLyBUaGlzIGlzIHVzZWQgdG8gZGlzcGxheSB0aGUgZmlsdGVyc1xuICAgICAgICB0aGlzLmZpbHRlclJlY2FwID0gbmV3IEFkdmFuY2VkU2VhcmNoRmlsdGVyUmVjYXAodGhpcy4kZm9ybSwgdGhpcy4kYWN0aXZlRmlsdGVyTGlzdCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy4kZm9ybS5vbignc3VibWl0LmNoYXJjb2FsLnNlYXJjaC5maWx0ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0KCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuJGFjdGl2ZUZpbHRlckxpc3Qub24oJ2NsaWNrJywgJy5qcy1yZW1vdmUtZmlsdGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRoYXQuZmlsdGVyUmVjYXAucmVtb3ZlQWN0aXZlRmlsdGVyKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBhY3RpdmUgZmlsdGVycy5cbiAgICAgICAgICAgIGlmICh0aGF0LmNvdW50Q2hhbmdlcygpID09PSAwICYmIHRoYXQuY2xlYXJPbkVtcHR5KSB7IHRoYXQuY2xlYXIoKTsgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtLm9uKCdjbGljay5jaGFyY29hbC5zZWFyY2guZmlsdGVyJywgJy5qcy1maWx0ZXItcmVzZXQnLCB0aGlzLmNsZWFyLmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIEhhbmRsZSBjaGFuZ2Ugc29ydGluZ1xuICAgICAgICB0aGlzLiRmb3JtLm9uKFxuICAgICAgICAgICAgJ2NsaWNrLmNoYXJjb2FsLnNlYXJjaC5maWx0ZXInLFxuICAgICAgICAgICAgJy5zb3J0LWRyb3Bkb3duICsgLmRyb3Bkb3duLW1lbnU+LmRyb3Bkb3duLWl0ZW0nLFxuICAgICAgICAgICAgdGhpcy5zb3J0LmJpbmQodGhpcylcbiAgICAgICAgKTtcblxuICAgICAgICAkKCcuYy1maWx0ZXJzLXRhYicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhYl9rZXkgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgIC8vIEFjdGl2YXRlIHRhYiBidXR0b25cbiAgICAgICAgICAgICQoJy5jLWZpbHRlcnMtdGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmMtZmlsdGVycy10YWIgYnV0dG9uIGknKS5hZGRDbGFzcygnZmEtYW5nbGUtZG93bicpO1xuICAgICAgICAgICAgLy8gRmxpcCBhcnJvd1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdidXR0b24gaScsIHRoaXMpLnJlbW92ZUNsYXNzKCdmYS1hbmdsZS1kb3duJykuYWRkQ2xhc3MoJ2ZhLWFuZ2xlLXVwJyk7XG5cbiAgICAgICAgICAgIC8vIEFjdGl2ZSB0YWIgZmllbGQgZ3JvdXBcbiAgICAgICAgICAgICQoJy5jLWZpbHRlci1ncm91cC5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuYy1maWx0ZXItZ3JvdXBbZGF0YS10YWI9XCInICsgdGFiX2tleSArICdcIl0nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgkKCcuYy1maWx0ZXJzLXRhYi5hY3RpdmUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICQoJy5jLWZpbHRlcnMtdGFiJykuZmlyc3QoKS5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gdGhpcztcblxuICAgICAgICAkKHRoaXMuJGV4cG9ydEJ0bikub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2lkZ2V0LmV4cG9ydCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCdpbnB1dCwgc2VsZWN0JywgdGhpcy4kZm9ybSkub24oJ2NoYW5nZScsIChlKSA9PiB3aWRnZXQub25GaWVsZENoYW5nZShlKSk7XG4gICAgICAgICQoJy5kYXRldGltZXBpY2tlcmlucHV0JywgdGhpcy4kZm9ybSkub24oJ2NoYW5nZS5kYXRldGltZXBpY2tlcicsIChlKSA9PiB3aWRnZXQub25GaWVsZENoYW5nZShlKSk7XG4gICAgICAgICQoJCgnaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pLCBzZWxlY3Q6bm90KFt0eXBlPWhpZGRlbl0pJywgdGhpcy4kZm9ybSlbMF0pLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvdW50QWN0aXZlRmlsdGVycygpID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhck9uRW1wdHkgPSB0cnVlO1xuXG4gICAgICAgICAgICBjb25zdCBtYW5hZ2VyID0gQ2hhcmNvYWwuQWRtaW4ubWFuYWdlcigpO1xuICAgICAgICAgICAgbWFuYWdlci5yZWFkeSgoKSA9PiB7IFxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZGdldHMgPSBtYW5hZ2VyLmNvbXBvbmVudHMud2lkZ2V0cztcblxuICAgICAgICAgICAgICAgIGlmICh3aWRnZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uICh3aWRnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghd2lkZ2V0IHx8IHR5cGVvZiB3aWRnZXQuc2V0X2ZpbHRlcnMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxfcm93cyA9IHdpZGdldC5vcHRzKCdkYXRhJykudG90YWxfcm93cyA/PyBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxfcm93cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG90YWxSb3dzKHRvdGFsX3Jvd3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25GaWVsZENoYW5nZShlKSB7XG4gICAgICAgIC8vIEFkZCBpdGVtIHRvIGFjdGl2ZS1maWx0ZXJzIGxpc3RcbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gdGhpcztcbiAgICAgICAgY29uc3QgdGFyZ2V0RmlsdGVyID0gZS50YXJnZXQ7XG4gICAgICAgIGxldCBmb3JtRmllbGQgICAgPSAkKHRhcmdldEZpbHRlcikuYXR0cignaWQnKTtcbiAgICAgICAgbGV0IGZpbHRlclZhbCAgICA9ICQodGFyZ2V0RmlsdGVyKS52YWwoKTtcblxuICAgICAgICAvLyBDaGVja2JveGVzIGFyZSBkaWZmZXJlbnQhXG4gICAgICAgIGlmIChlLnRhcmdldC50eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBmaWx0ZXJWYWwgPSAkKHRhcmdldEZpbHRlcikuaXMoJzpjaGVja2VkJykgPyAnY2hlY2tlZCcgOiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGVcbiAgICAgICAgaWYgKHR5cGVvZiBlLmRhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJJbnB1dCAgICAgPSAkKCdpbnB1dCcsIHRhcmdldEZpbHRlcikuZmlyc3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcklucHV0TmFtZSA9IGZpbHRlcklucHV0LmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIGZvcm1GaWVsZCAgICAgICAgICAgICA9IGZpbHRlcklucHV0LmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgICAgIGlmIChmaWx0ZXJJbnB1dE5hbWUuZW5kc1dpdGgoXCJbdG9dXCIpIHx8IGZpbHRlcklucHV0TmFtZS5lbmRzV2l0aChcIltmcm9tXVwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElzIGEgZGF0ZSByYW5nZVxuICAgICAgICAgICAgICAgIGNvbnN0IHByaW1hcnlOYW1lID0gZmlsdGVySW5wdXROYW1lLnJlcGxhY2UoJ1tmcm9tXScsICcnKS5yZXBsYWNlKCdbdG9dJywgJycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVzID0gW1xuICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiJyArIHByaW1hcnlOYW1lICsgJ1tmcm9tXVwiXScpLnZhbCgpIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCInICsgcHJpbWFyeU5hbWUgKyAnW3RvXVwiXScpLnZhbCgpICAgfHwgbnVsbFxuICAgICAgICAgICAgICAgIF0uZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50ICE9PSBudWxsO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZmlsdGVyVmFsID0gZGF0ZXMuam9pbignIC0gJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbHRlclZhbCA9IGZpbHRlcklucHV0LnZhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaWx0ZXJWYWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB3aWRnZXQucmVtb3ZlQWN0aXZlRmlsdGVyKGZvcm1GaWVsZCk7XG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0RmlsdGVyKS5pcygnaW5wdXQsIHNlbGVjdCcpKSB7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXRGaWx0ZXIpLmZpbmQoJy5jaGFuZ2VkJykucmVtb3ZlQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXRGaWx0ZXIpLnJlbW92ZUNsYXNzKCdjaGFuZ2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgaW5wdXRzIHdpdGggdmFsdWVzXG4gICAgICAgICAgICBpZiAoISQodGFyZ2V0RmlsdGVyKS5pcygnaW5wdXQsIHNlbGVjdCcpKSB7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXRGaWx0ZXIpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS5hZGRDbGFzcygnY2hhbmdlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRhcmdldEZpbHRlcikuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpZGdldC5maWx0ZXJSZWNhcC5yZWZyZXNoKCk7XG4gICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmcgaWYgdGhlcmUgYXJlIG5vIG1vcmUgYWN0aXZlIGZpbHRlcnMuXG4gICAgICAgIGlmICh3aWRnZXQuY291bnRDaGFuZ2VzKCkgPT09IDAgJiYgd2lkZ2V0LmNsZWFyT25FbXB0eSkgeyB3aWRnZXQuY2xlYXIoKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvdW50IHRvdGFsIGFjdGl2ZSBmaWx0ZXJzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge2ludH0gVG90YWwgYWN0aXZlIGZpbHRlcnMuXG4gICAgICovXG4gICAgY291bnRBY3RpdmVGaWx0ZXJzKCkge1xuICAgICAgICByZXR1cm4gJCgnbGknLCB0aGlzLiRhY3RpdmVGaWx0ZXJMaXN0KS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gZmlsdGVyIElEIG9mICdmcm9tJy8ndG8nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlcklkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBjbGVhbkZpbHRlcklkKGZpbHRlcklkKSB7XG4gICAgICAgIGxldCBmaWx0ZXJJZENsZWFuID0gZmlsdGVySWQ7XG5cbiAgICAgICAgaWYgKGZpbHRlcklkLmluY2x1ZGVzKCdmcm9tX2lucHV0XycpIHx8IGZpbHRlcklkLmluY2x1ZGVzKCd0b19pbnB1dF8nKSkge1xuICAgICAgICAgICAgZmlsdGVySWRDbGVhbiA9IGZpbHRlcklkQ2xlYW4ucmVwbGFjZSgnZnJvbV8nLCAnJykucmVwbGFjZSgndG9fJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcklkQ2xlYW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGl0ZW0gZnJvbSBhY3RpdmUgZmlsdGVyIGxpc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0IFJlbW92ZSBFdmVudCBvciB0YXJnZXQgc3RyaW5nLlxuICAgICAqL1xuICAgIHJlbW92ZUFjdGl2ZUZpbHRlcih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclJlY2FwLnJlbW92ZUFjdGl2ZUZpbHRlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0ID0gdGhpcy5jbGVhbkZpbHRlcklkKHRhcmdldCk7XG4gICAgICAgIHRhcmdldCA9ICQoJ2xpW2RhdGEta2V5PVwiJyArIHRhcmdldCArICdcIl0nLCB0aGlzLiRhY3RpdmVGaWx0ZXJMaXN0KTtcbiAgICAgICAgdGhpcy5maWx0ZXJSZWNhcC5yZW1vdmVBY3RpdmVGaWx0ZXIodGFyZ2V0LmdldCgwKSk7XG4gICAgfVxuXG4gICAgc2V0VG90YWxSb3dzKHRvdGFsUm93cykge1xuICAgICAgICB0aGlzLnRvdGFsUm93cyA9IHRvdGFsUm93cztcbiAgICAgICAgY29uc3QgdG90YWxSb3dzRWwgPSAkKCcuZmlsdGVycy10b3RhbC1yb3dzJykuZmlyc3QoKTtcbiAgICAgICAgdG90YWxSb3dzRWwuZmluZCgnLnJvdy1jb3VudCcpLnRleHQodGhpcy50b3RhbFJvd3MpO1xuICAgICAgICB0b3RhbFJvd3NFbC5hdHRyKCdkYXRhLWNvdW50JywgdGhpcy50b3RhbFJvd3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvdW50IGFsbCBjaGFuZ2VkIGZpbHRlcnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7aW50fSBDaGFuZ2UgY291bnQuXG4gICAgICovXG4gICAgY291bnRDaGFuZ2VzKCkge1xuICAgICAgICBjb25zdCBjaGFuZ2VDb3VudCA9ICQoJ2lucHV0LmNoYW5nZWQsIHNlbGVjdC5jaGFuZ2VkJywgdGhpcy4kZm9ybSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBoYXNDaGFuZ2VzID0gY2hhbmdlQ291bnQgPiAwO1xuICAgICAgICBjb25zdCBjaGFuZ2VDb3VudFN0cmluZyA9IGhhc0NoYW5nZXMgPyAnKCcgKyBjaGFuZ2VDb3VudCArICcpJyA6ICcnO1xuXG4gICAgICAgIC8vIERpc2FibGUgYnV0dG9ucyB3aGVuIHRoZXJlIGFyZSBubyBjaGFuZ2VzXG4gICAgICAgICQoJy5qcy1maWx0ZXItYXBwbHksIC5qcy1maWx0ZXItcmVzZXQsIC5qcy1maWx0ZXItZXhwb3J0JywgdGhpcy4kZm9ybSkucHJvcCgnZGlzYWJsZWQnLCAhaGFzQ2hhbmdlcyk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBsYWJlbCB0byBzaW5ndWxhci9wbHVyYWwgZm9ybWF0XG4gICAgICAgICQoJy5idG4tbGFiZWwgc3Bhbi5hY3RpdmUnLCB0aGlzLiRhcHBseUJ0bikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcuYnRuLWxhYmVsIHNwYW4uYWN0aXZlJywgdGhpcy4kZXhwb3J0QnRuKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoKGNoYW5nZUNvdW50ID09PSAxID8gJy5idG4tbGFiZWwtc2luZ3VsYXInIDogJy5idG4tbGFiZWwtcGx1cmFsJyksIHRoaXMuJGFwcGx5QnRuKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgLy8gQXBwZW5kIGNoYW5nZSBjb3VudCB0byBhcHBseSBidXR0b25cbiAgICAgICAgJCgnLmZpbHRlci1hcHBseS1jb3VudCcsIHRoaXMuJGFwcGx5QnRuKS50ZXh0KGNoYW5nZUNvdW50U3RyaW5nKTtcblxuICAgICAgICAvLyBBZGQgdGFiIGZpbHRlciBjb3VudCB0byB0YWIgbGFiZWxcbiAgICAgICAgJCgnLmMtZmlsdGVyLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YWJDaGFuZ2VDb3VudCA9ICQoJ2lucHV0LmNoYW5nZWQsIHNlbGVjdC5jaGFuZ2VkJywgdGhpcykubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgdGFiRmlsdGVyQ291bnRFbCA9ICQoJy5jLWZpbHRlcnMtdGFiW2RhdGEtdGFiPVwiJyArICQodGhpcykuZGF0YSgndGFiJykgKyAnXCJdIC50YWItZmlsdGVyLWNvdW50Jyk7XG5cbiAgICAgICAgICAgIHRhYkZpbHRlckNvdW50RWwuYXR0cignZGF0YS1jb3VudCcsIHRhYkNoYW5nZUNvdW50KTtcbiAgICAgICAgICAgIHRhYkZpbHRlckNvdW50RWwuZmluZCgnLmNvdW50JykudGV4dCh0YWJDaGFuZ2VDb3VudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjaGFuZ2VDb3VudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZpbHRlciB3aWRnZXRzLlxuICAgICAqXG4gICAgICogQHJldHVybiB0aGlzXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIC8vIFJlc2V0IGZvcm1cbiAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVGaWx0ZXIoKTtcblxuICAgICAgICAvLyBDbGVhciBzZWxlY3RzXG4gICAgICAgIHRoaXMuJGZvcm0uZmluZCgnc2VsZWN0JykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICQoaXRlbSkudmFsKCcnKTtcbiAgICAgICAgICAgICQoaXRlbSkuc2VsZWN0cGlja2VyKCdkZXNlbGVjdEFsbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDbGVhciBkYXRlIHBpY2tlcnNcbiAgICAgICAgJCgnLmRhdGV0aW1lcGlja2VyaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQoJy5kYXRldGltZXBpY2tlci1pbnB1dCcsIHRoaXMpLnZhbCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0ZXRpbWVwaWNrZXIoJ2NsZWFyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTZXQgY2hhbmdlZCBpbnB1dHMgdG8gdW5jaGFuZ2VkIHN0YXRlXG4gICAgICAgICQoJy5jaGFuZ2VkJywgdGhpcy4kZm9ybSkucmVtb3ZlQ2xhc3MoJ2NoYW5nZWQnKTtcbiAgICAgICAgLy8gVW5yZXF1aXJlIGZpZWxkc1xuICAgICAgICAkKCdpbnB1dCwgc2VsZWN0JywgdGhpcy4kZm9ybSkucHJvcCgncmVxdWlyZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5jb3VudENoYW5nZXMoKTtcblxuICAgICAgICAvLyBDbGVhciBhY3RpdmUgZmlsdGVyIGxpc3RcbiAgICAgICAgJCgnbGknLCB0aGlzLiRhY3RpdmVGaWx0ZXJMaXN0KS5yZW1vdmUoKTtcbiAgICAgICAgLy8gUmVzZXQgc29ydCBkcm9wZG93blxuICAgICAgICAkKHRoaXMuJHNvcnRCdG4pLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXG4gICAgICAgIHRoaXMuc3VibWl0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBhIGZpbHRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWx0ZXJJZCBGaWx0ZXIgSUQuXG4gICAgICogQHJldHVybiB0aGlzXG4gICAgICovXG4gICAgY2xlYXJGaWx0ZXIobGlzdEl0ZW0pIHtcbiAgICAgICAgaWYgKCEkKGxpc3RJdGVtKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbHRlcklkID0gJChsaXN0SXRlbSkuZGF0YSgna2V5Jyk7XG4gICAgICAgIGNvbnN0IGxpc3RJdGVtVHlwZSA9ICQobGlzdEl0ZW0pLmRhdGEoJ3R5cGUnKTtcbiAgICAgICAgbGV0IGZpbHRlcklucHV0LCBmaWx0ZXJUeXBlO1xuXG4gICAgICAgIGlmIChsaXN0SXRlbVR5cGUuaW5jbHVkZXMoJ2RhdGUnKSkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGRhdGUgcGlja2Vyc1xuICAgICAgICAgICAgaWYgKGxpc3RJdGVtVHlwZSA9PT0gJ2RhdGUtcmFuZ2UnKSB7XG4gICAgICAgICAgICAgICAgLy8gRGF0ZSBSYW5nZVxuICAgICAgICAgICAgICAgIGZpbHRlclR5cGUgPSAnZGF0ZS1yYW5nZSc7XG4gICAgICAgICAgICAgICAgZmlsdGVySW5wdXQgPSAkKCcjZnJvbV8nICsgZmlsdGVySWQsIHRoaXMuJGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTaW5nbGUgRGF0ZVxuICAgICAgICAgICAgICAgIGZpbHRlclR5cGUgPSAnZGF0ZSc7XG4gICAgICAgICAgICAgICAgZmlsdGVySW5wdXQgPSAkKCcjJyArIGZpbHRlcklkLCB0aGlzLiRmb3JtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBhbGwgaW5wdXRzXG4gICAgICAgICAgICBmaWx0ZXJJbnB1dCA9ICQoJyMnICsgZmlsdGVySWQsIHRoaXMuJGZvcm0pO1xuICAgICAgICAgICAgZmlsdGVyVHlwZSA9IGZpbHRlcklucHV0Lmxlbmd0aCA/IGZpbHRlcklucHV0WzBdLnR5cGUgOiAndW5rbm93bic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNldCByZXNwZWN0aXZlIGlucHV0XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgICAgICAgIGZpbHRlcklucHV0LnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3NlbGVjdC1vbmUnOlxuICAgICAgICAgICAgY2FzZSAnc2VsZWN0LW11bHRpcGxlJzpcbiAgICAgICAgICAgICAgICAkKGZpbHRlcklucHV0KS52YWwoJycpO1xuICAgICAgICAgICAgICAgICQoZmlsdGVySW5wdXQpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdkYXRlLXJhbmdlJzpcbiAgICAgICAgICAgICAgICBmaWx0ZXJJbnB1dC5jbG9zZXN0KCdmaWVsZHNldCcpLmZpbmQoJy5kYXRldGltZXBpY2tlcmlucHV0JykuZGF0ZXRpbWVwaWNrZXIoJ2NsZWFyJyk7XG4gICAgICAgICAgICAgICAgZmlsdGVySW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKS5maW5kKCcuY2hhbmdlZCcpLnJlbW92ZUNsYXNzKCdjaGFuZ2VkJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZmlsdGVySW5wdXQudmFsKCcnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgICQoZmlsdGVySW5wdXQpLnJlbW92ZUNsYXNzKCdjaGFuZ2VkJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSB3aWRnZXQgc29ydGluZyBvcmRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlIEV2ZW50LlxuICAgICAqIEByZXR1cm4gdGhpc1xuICAgICAqL1xuICAgIHNvcnQoZSkge1xuICAgICAgICBjb25zdCBvcHRpb25FbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kcm9wZG93bi1pdGVtJyk7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gJCgnLmJ0bi1sYWJlbCcsIG9wdGlvbkVsKS50ZXh0KCk7XG5cbiAgICAgICAgaWYgKCQob3B0aW9uRWwpLmhhc0NsYXNzKCdkZWZhdWx0JykpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IGJ1dHRvbiB0byBkZWZhdWx0IHNvcnRcbiAgICAgICAgICAgICQodGhpcy4kc29ydEJ0bikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHNvcnRcbiAgICAgICAgICAgICQodGhpcy4kc29ydEJ0bikuYWRkQ2xhc3MoJ3NlbGVjdGVkJykuZGF0YSh7XG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IG9wdGlvbkVsLmRhdGEoJ3Byb3BlcnR5JyksXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBvcHRpb25FbC5kYXRhKCdkaXJlY3Rpb24nKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuc29ydC1vcHRpb24nLCB0aGlzLiRzb3J0QnRuKS5maW5kKCcuc29ydC1vcHRpb24tdmFsdWUnKS50ZXh0KGxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3VibWl0KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsdGVyIG9iamVjdCBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG5hbWUgSW5wdXQgZG9tIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBGaWx0ZXIgbmFtZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgRmlsdGVyIHZhbHVlLlxuICAgICAqL1xuICAgIGZpbHRlck9iaihpbnB1dCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgZm9ybUZpZWxkICAgID0gJChpbnB1dCkuY2xvc2VzdCgnLmZvcm0tZmllbGQnKTtcbiAgICAgICAgY29uc3QgZGF0YU9wZXJhdG9yID0gZm9ybUZpZWxkLmRhdGEoJ29wZXJhdG9yJykgfHwgJyc7XG5cbiAgICAgICAgdGhpcy5uYW1lICAgICA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgICAgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9ICc9JztcbiAgICAgICAgdGhpcy50eXBlICAgICA9IGlucHV0LnR5cGU7XG5cbiAgICAgICAgdGhpcy5wYXJzZUludmFsaWRCZXR3ZWVuID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgICAgID0gJ2RhdGUnO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSAgICA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRvciA9IG5hbWUuZW5kc1dpdGgoXCJbZnJvbV1cIikgPyAnPicgOiAnPCc7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGRhdGFPcGVyYXRvci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMub3BlcmF0b3IgPSBkYXRhT3BlcmF0b3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZXh0IGZpZWxkXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICd0ZXh0JyAmJiB0aGlzLm9wZXJhdG9yID09PSAnTElLRScpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAnJScgKyB0aGlzLnZhbHVlICsgJyUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3dpdGNoIGNoZWNrYm94XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBpbnB1dC5jaGVja2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZScpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAkKGlucHV0KS52YWwoKTtcbiAgICAgICAgICAgIHRoaXMub3BlcmF0b3IgPSBcIklOXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZS5lbmRzV2l0aChcIltmcm9tXVwiKSB8fCBuYW1lLmVuZHNXaXRoKFwiW3RvXVwiKSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gJ2RhdGVyYW5nZSc7XG4gICAgICAgICAgICB0aGlzLm9wZXJhdG9yID0gJ0JFVFdFRU4nO1xuICAgICAgICAgICAgdGhpcy5tYXRjaGluZyA9IG5hbWUuZW5kc1dpdGgoJ1tmcm9tXScpID8gbmFtZS5yZXBsYWNlKCdbZnJvbV0nLCAnW3RvXScpIDogbmFtZS5yZXBsYWNlKCdbdG9dJywgJ1tmcm9tXScpO1xuXG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ192YWx1ZSA9ICQoJ2lucHV0W25hbWU9XCInICsgdGhpcy5tYXRjaGluZyArICdcIl0nKS52YWwoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlLmxlbmd0aCB8fCAhbWF0Y2hpbmdfdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlSW52YWxpZEJldHdlZW4odGhpcy5tYXRjaGluZywgbWF0Y2hpbmdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VJbnZhbGlkQmV0d2Vlbih0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1Ym1pdCB0aGUgZmlsdGVycyB0byBhbGwgd2lkZ2V0cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdGhpc1xuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgbGV0IGRhdGEsIGZpZWxkcywgZmlsdGVycyA9IFtdLCBtYW5hZ2VyLCB3aWRnZXRzLCByZXF1ZXN0O1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgICAgICBtYW5hZ2VyID0gQ2hhcmNvYWwuQWRtaW4ubWFuYWdlcigpO1xuICAgICAgICB3aWRnZXRzID0gbWFuYWdlci5jb21wb25lbnRzLndpZGdldHM7XG5cbiAgICAgICAgaWYgKHdpZGdldHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgICAgICAgIGZpZWxkcyA9IHRoaXMuJGZvcm0uZmluZCgnOmlucHV0LmNoYW5nZWQnKTtcblxuICAgICAgICAgICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24gKGksIGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEhZmllbGQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKG5ldyB0aGF0LmZpbHRlck9iaihmaWVsZCwgZmllbGQubmFtZSwgZmllbGQudmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jbGVhck9uRW1wdHkgPSBmaWx0ZXJzLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgICAgIHJlcXVlc3QgPSB0aGlzLnByZXBhcmVfcmVxdWVzdChmaWx0ZXJzKTtcblxuICAgICAgICAgICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uICh3aWRnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKHJlcXVlc3QsIHdpZGdldCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgICBsZXQgZGF0YSwgZmllbGRzLCBmaWx0ZXJzID0gW10sIG1hbmFnZXIsIHdpZGdldHMsIHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIG1hbmFnZXIgPSBDaGFyY29hbC5BZG1pbi5tYW5hZ2VyKCk7XG4gICAgICAgIHdpZGdldHMgPSBtYW5hZ2VyLmNvbXBvbmVudHMud2lkZ2V0cztcblxuICAgICAgICBpZiAod2lkZ2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy4kZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgICAgICAgZmllbGRzID0gdGhpcy4kZm9ybS5maW5kKCc6aW5wdXQuY2hhbmdlZCcpO1xuXG4gICAgICAgICAgICAkLmVhY2goZmllbGRzLCBmdW5jdGlvbiAoaSwgZmllbGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoISFmaWVsZC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2gobmV3IHRoYXQuZmlsdGVyT2JqKGZpZWxkLCBmaWVsZC5uYW1lLCBmaWVsZC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXF1ZXN0ID0gdGhpcy5wcmVwYXJlX3JlcXVlc3QoZmlsdGVycyk7XG4gICAgICAgICAgICB3aWRnZXRzLmZvckVhY2goZnVuY3Rpb24gKHdpZGdldCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkZ2V0LnNldF9maWx0ZXJzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB3aWRnZXRfdHlwZTogd2lkZ2V0LndpZGdldF90eXBlKCksXG4gICAgICAgICAgICAgICAgICAgIHdpZGdldF9vcHRpb25zOiB3aWRnZXQud2lkZ2V0X29wdGlvbnMoKSxcbiAgICAgICAgICAgICAgICAgICAgd2l0aF9kYXRhOiB0cnVlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5maWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaChyZXF1ZXN0LmZpbHRlcnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0Lm9yZGVycykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcnMucHVzaChyZXF1ZXN0Lm9yZGVycyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YS53aWRnZXRfb3B0aW9ucy5jb2xsZWN0aW9uX2NvbmZpZy5maWx0ZXJzID0gZmlsdGVycyB8fCB7fTtcbiAgICAgICAgICAgICAgICBkYXRhLndpZGdldF9vcHRpb25zLmNvbGxlY3Rpb25fY29uZmlnLm9yZGVycyA9IG9yZGVycyB8fCB7fTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgY29uc3QgdXJsID0gQ2hhcmNvYWwuQWRtaW4uYWRtaW5fdXJsKCkgKyAnYWR2YW5jZWQtc2VhcmNoL2V4cG9ydCcgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXG4gICAgICAgICAgICAkKHRoaXMuJGZvcm0pLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIHRoaXMucmVsb2FkWEhSID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBzdWNjZXNzLCBmYWlsdXJlLCBjb21wbGV0ZTtcblxuICAgICAgICAgICAgc3VjY2VzcyA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2Uud2lkZ2V0X2lkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5mZWVkYmFja3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHdpZGdldEwxMG4ubG9hZGluZ0ZhaWxlZFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlLmNhbGwodGhpcywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkID0gcmVzcG9uc2Uud2lkZ2V0X2lkO1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0X2lkKHdpZCk7XG4gICAgICAgICAgICAgICAgdGhhdC5hZGRfb3B0cygnaWQnLCB3aWQpO1xuICAgICAgICAgICAgICAgIHRoYXQuYWRkX29wdHMoJ3dpZGdldF9pZCcsIHdpZCk7XG5cbiAgICAgICAgICAgICAgICB0aGF0LndpZGdldF9pZCA9IHdpZDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlLmZpbGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmZlZWRiYWNrcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldmVsOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogd2lkZ2V0TDEwbi5sb2FkaW5nRmFpbGVkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlLmNhbGwodGhpcywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBDaGFyY29hbC5BZG1pbi5hZG1pbl91cmwoKSArICdhZHZhbmNlZC1zZWFyY2gvZG93bmxvYWQ/ZmlsZW5hbWU9JyArIHJlc3BvbnNlLmZpbGU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmYWlsdXJlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmZlZWRiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2hhcmNvYWwuQWRtaW4uZmVlZGJhY2socmVzcG9uc2UuZmVlZGJhY2tzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBDaGFyY29hbC5BZG1pbi5mZWVkYmFjayhbe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWw6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB3aWRnZXRMMTBuLmxvYWRpbmdGYWlsZWRcbiAgICAgICAgICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhhdC5zdXBwcmVzc19mZWVkYmFjaygpKSB7XG4gICAgICAgICAgICAgICAgICAgIENoYXJjb2FsLkFkbWluLmZlZWRiYWNrKCkuZGlzcGF0Y2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh0aGF0LiRmb3JtKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQ2hhcmNvYWwuQWRtaW4ucmVzb2x2ZVNpbXBsZUpzb25YaHIoXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxvYWRYSFIsXG4gICAgICAgICAgICAgICAgc3VjY2VzcyxcbiAgICAgICAgICAgICAgICBmYWlsdXJlLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlcyBhIHNlYXJjaCByZXF1ZXN0IGZyb20gYSBxdWVyeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2FycmF5fSBxdWVyeSAtIFRoZSBmaWx0ZXJzLlxuICAgICAqIEByZXR1cm4ge29iamVjdHxudWxsfSBBIHNlYXJjaCByZXF1ZXN0IG9iamVjdCBvciBOVUxMLlxuICAgICAqL1xuICAgIHByZXBhcmVfcmVxdWVzdChwX2ZpbHRlcnMpIHtcbiAgICAgICAgbGV0IHJlcXVlc3QgICAgICAgICAgICA9IG51bGwsIGZpbHRlcnMgPSBbXSwgb3B0cztcbiAgICAgICAgY29uc3QgZGF0YSAgICAgICAgICAgICA9IHRoaXMub3B0cygnZGF0YScpO1xuICAgICAgICBjb25zdCBvcmRlclByb3BlcnR5ICAgID0gJCh0aGlzLiRzb3J0QnRuKS5kYXRhKCdwcm9wZXJ0eScpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uX3RhYmxlID0gdGhpcy5vcHRzKCdjb2xsZWN0aW9uX3RhYmxlJyk7XG5cbiAgICAgICAgcF9maWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGZpbHRlcl9vYmopIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lICAgICA9IGZpbHRlcl9vYmoubmFtZS5yZXBsYWNlKC8oXFxbLiopL2dpLCAnJyk7XG4gICAgICAgICAgICBsZXQgZmlsdGVyX3RhYmxlICAgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHZhbHVlX292ZXJyaWRlID0gW107XG5cbiAgICAgICAgICAgIG9wdHMgPSBkYXRhLnByb3BlcnRpZXNfb3B0aW9uc1twcm9wTmFtZV0gfHwge307XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50YWJsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0cy50YWJsZSAhPT0gY29sbGVjdGlvbl90YWJsZSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcl90YWJsZSA9IG9wdHMudGFibGUgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWx0ZXJfb2JqICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJfb2JqLnR5cGUgPT09ICdkYXRlcmFuZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElzIGRhdGVyYW5nZSBpbnB1dFxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyX29iai5vcGVyYXRvciA9PT0gJ0JFVFdFRU4nICYmIGZpbHRlcl9vYmoubmFtZS5lbmRzV2l0aCgnW3RvXScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaGluZ192YWx1ZSA9ICQoJ2lucHV0W25hbWU9XCInICsgZmlsdGVyX29iai5tYXRjaGluZyArICdcIl0nKS52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyX29iai5uYW1lLmVuZHNXaXRoKCdbZnJvbV0nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVfb3ZlcnJpZGUgPSBbZmlsdGVyX29iai52YWx1ZSwgbWF0Y2hpbmdfdmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVfb3ZlcnJpZGUgPSBbbWF0Y2hpbmdfdmFsdWUsIGZpbHRlcl9vYmoudmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvbmp1bmN0aW9uOiBvcHRzLmNvbmp1bmN0aW9uIHx8ICdBTkQnLFxuICAgICAgICAgICAgICAgIHRhYmxlOiBmaWx0ZXJfdGFibGUsXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BOYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZV9vdmVycmlkZS5sZW5ndGggPyB2YWx1ZV9vdmVycmlkZSA6IGZpbHRlcl9vYmoudmFsdWUsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IGZpbHRlcl9vYmoub3BlcmF0b3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgZmlsdGVyczogbnVsbCxcbiAgICAgICAgICAgIG9yZGVyczogbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZmlsdGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcXVlc3QuZmlsdGVycyA9IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICAgICAgICAgIHRhYmxlOiBjb2xsZWN0aW9uX3RhYmxlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQodGhpcy4kc29ydEJ0bikuaGFzQ2xhc3MoJ3NlbGVjdGVkJykgJiYgb3JkZXJQcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmVxdWVzdC5vcmRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAkKHRoaXMuJHNvcnRCdG4pLmRhdGEoJ2RpcmVjdGlvbicpLFxuICAgICAgICAgICAgICAgIG1vZGU6ICQodGhpcy4kc29ydEJ0bikuZGF0YSgnZGlyZWN0aW9uJyksXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IG9yZGVyUHJvcGVydHlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBldmVudCB0byBhbGwgd2lkZ2V0cyB0aGF0IGNhbiBsaXN0ZW4gdG8gaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtvYmplY3R9IHJlcXVlc3QgLSBUaGUgc2VhcmNoIHJlcXVlc3QuXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSB3aWRnZXQgIC0gVGhlIHdpZGdldCB0byBzZWFyY2ggb24uXG4gICAgICogQHJldHVybiB0aGlzXG4gICAgICovXG4gICAgZGlzcGF0Y2gocmVxdWVzdCwgd2lkZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVsb2FkaW5nIHx8ICF3aWRnZXQgfHwgdHlwZW9mIHdpZGdldC5zZXRfZmlsdGVycyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHdpZGdldC5wYWdpbmF0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgd2lkZ2V0LnBhZ2luYXRpb24ucGFnZSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplIGZpbHRlcnMgYXJyYXlcbiAgICAgICAgY29uc3QgZmlsdGVycyA9IFtdO1xuXG4gICAgICAgIC8vIEFkZCBpc0FkdmFuY2VkU2VhcmNoIGR1bW15IGZpbHRlci5cbiAgICAgICAgLy8gVGhpcyBjYW4gYmUgdXNlZCB0byBkZXRlY3QgaWYgYSB0YWJsZSB3aWRnZXQgd2FzIGxvYWRlZCB1c2luZyBBZHZhbmNlZCBTZWFyY2hcbiAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgIGNvbmp1bmN0aW9uOiAnQU5EJyxcbiAgICAgICAgICAgIG5hbWU6ICdpc0FkdmFuY2VkU2VhcmNoJyxcbiAgICAgICAgICAgIGNvbmRpdGlvbjogJygxID0gMSknLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVxdWVzdC5maWx0ZXJzKSB7XG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2gocmVxdWVzdC5maWx0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpZGdldC5zZXRfZmlsdGVycyhmaWx0ZXJzKTtcblxuICAgICAgICBjb25zdCBvcmRlcnMgPSBbXTtcbiAgICAgICAgaWYgKHJlcXVlc3Qub3JkZXJzKSB7XG4gICAgICAgICAgICBvcmRlcnMucHVzaChyZXF1ZXN0Lm9yZGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMuJGZvcm0pLmFkZENsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgIHRoaXMuaXNSZWxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgIHdpZGdldC5zZXRfb3JkZXJzKG9yZGVycyk7XG5cbiAgICAgICAgLy8gU3VwcG9ydCBzaXRlIHNlYXJjaFxuICAgICAgICBjb25zdCBzaXRlX3NlYXJjaCA9IHRoaXMub3B0cygnc2l0ZV9zZWFyY2gnKTtcblxuICAgICAgICBpZiAoc2l0ZV9zZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaF93aWRnZXQgPSBDaGFyY29hbC5BZG1pbi5tYW5hZ2VyKCkuZ2V0X3dpZGdldChzaXRlX3NlYXJjaCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkZ2V0LnNldF9zZWFyY2hfcXVlcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hfd2lkZ2V0LnNldF9zZWFyY2hfcXVlcnkoc2VhcmNoX3dpZGdldC4kaW5wdXQudmFsKCkpO1xuICAgICAgICAgICAgICAgIHdpZGdldC5zZXRfc2VhcmNoX3F1ZXJ5KHNlYXJjaF93aWRnZXQuc2VhcmNoX3F1ZXJ5KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpZGdldC5zZXRfZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgd2lkZ2V0LnNldF9maWx0ZXIoJ3NlYXJjaCcsIHNlYXJjaF93aWRnZXQuc2VhcmNoX2ZpbHRlcnMoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWxvYWQgdGhlIHdpZGdldFxuICAgICAgICB3aWRnZXQucmVsb2FkKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb3RhbFJvd3MocmVzcG9uc2Uud2lkZ2V0X2RhdGEudG90YWxfcm93cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMuJGZvcm0pLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLmlzUmVsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBZHZhbmNlZFNlYXJjaDsiLCJjbGFzcyBBZHZhbmNlZFNlYXJjaEZpbHRlclJlY2FwIHtcbiAgICBjb25zdHJ1Y3RvcigkZm9ybSwgJGFjdGl2ZUZpbHRlckxpc3QsIHBhcmVudCkge1xuICAgICAgICB0aGlzLiRmb3JtID0gJGZvcm07XG4gICAgICAgIHRoaXMuJGFjdGl2ZUZpbHRlckxpc3QgPSAkYWN0aXZlRmlsdGVyTGlzdDtcbiAgICAgICAgdGhpcy5maWx0ZXJPYmplY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50XG4gICAgICogQ2FsbCB3aGVuIGFueXRoaW5nIGNoYW5nZXMgaW4gdGhlIGZpbHRlciBhcmVhXG4gICAgICovXG4gICAgcmVmcmVzaCgpIHtcbiAgICAgICAgdGhpcy5idWlsZEZpbHRlck9iamVjdEZyb21JbnB1dHMoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmlsdGVycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoIGFsbCBpbnB1dHMgYW5kIGJ1aWxkIGEganNvbiB1c2FibGUgdG8gZGlzcGxheSBmaWx0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGNvbnRhaW5lclxuICAgICAqL1xuICAgIGJ1aWxkRmlsdGVyT2JqZWN0RnJvbUlucHV0cygpIHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zdCBmb3JtRmllbGRJZHMgPSBbXTtcblxuICAgICAgICAkKCdpbnB1dCwgc2VsZWN0JywgdGhpcy4kZm9ybSkuZWFjaChmdW5jdGlvbiAoaSwgY3VycmVudCkge1xuICAgICAgICAgICAgLy8gU2tpcCB1bmZpbGxlZCBmaWx0ZXJzXG4gICAgICAgICAgICAvLyBAdG9kbyBBZGQgbW9yZSBjb250ZXh0IHRoYW4gb25seSAhY3VycmVudC52YWx1ZVxuICAgICAgICAgICAgaWYgKCFjdXJyZW50LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50LnR5cGUgPT09ICdjaGVja2JveCcgJiYgISQoY3VycmVudCkuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGF0LmV4dHJhY3RMYWJlbEFuZFZhbHVlRnJvbUlucHV0KGN1cnJlbnQpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWZvcm1GaWVsZElkcy5pbmNsdWRlcyh2YWx1ZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRJZHMucHVzaCh2YWx1ZS5pZCk7XG4gICAgICAgICAgICAgICAgLy8gUG9wdWxhdGUgb3V0cHV0XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZpbHRlck9iamVjdCA9IG91dHB1dDtcbiAgICB9XG5cbiAgICBleHRyYWN0TGFiZWxBbmRWYWx1ZUZyb21JbnB1dChkb21FbGVtZW50KSB7XG4gICAgICAgIGxldCB0bXAgPSBudWxsO1xuXG4gICAgICAgIC8vIEJhc2UgdmFsdWVzXG4gICAgICAgIGNvbnN0ICRkb21FbGVtZW50ID0gJChkb21FbGVtZW50KTtcbiAgICAgICAgbGV0IGZvcm1GaWVsZCA9ICRkb21FbGVtZW50LmF0dHIoJ2lkJyk7XG4gICAgICAgIGxldCBmaWx0ZXJWYWwgPSAkZG9tRWxlbWVudC52YWwoKTtcbiAgICAgICAgbGV0IGZpbHRlclR5cGUgPSAnaW5wdXQnO1xuXG4gICAgICAgIC8vIEZpbHRlciBuYW1lIGZyb20gbGFiZWxcbiAgICAgICAgY29uc3QgZmlsdGVyV3JhcHBlciA9ICRkb21FbGVtZW50LmNsb3Nlc3QoJ2ZpZWxkc2V0Jyk7XG4gICAgICAgIGNvbnN0IGZpbHRlck5hbWUgPSAkKCdsYWJlbCcsIGZpbHRlcldyYXBwZXIpLmZpcnN0KCkudGV4dCgpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0TmFtZSA9ICRkb21FbGVtZW50LmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0TmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGV0aW1lIHJhbmdlXG4gICAgICAgIGlmIChpbnB1dE5hbWUuZW5kc1dpdGgoXCJbdG9dXCIpIHx8IGlucHV0TmFtZS5lbmRzV2l0aChcIltmcm9tXVwiKSkge1xuICAgICAgICAgICAgLy8gVGhlIGZvcm1GaWVsZCBpZCB3aWxsIGJlIHVzZWQgdG8gcHJldmVudCBoYXZpbmcgdHdpY2UgdGhlIHNhZmUgZmlsdGVyIGRpc3BsYXllZCBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgLy8gU2luY2UgdGhlIGZyb20gYW5kIHRvIGlucHV0cyBoYXZlIHRoZSBzYW1lIElEIGV4Y2VwdCBmb3IgdGhhdCBwcmVmaXhcbiAgICAgICAgICAgIGZvcm1GaWVsZCA9IGZvcm1GaWVsZC5yZXBsYWNlKCdmcm9tXycsICcnKS5yZXBsYWNlKCd0b18nLCAnJyk7XG4gICAgICAgICAgICB0bXAgPSB0aGlzLmV4dHJhY3RGcm9tRGF0ZVJhbmdlKGRvbUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VsZWN0XG4gICAgICAgIGlmIChkb21FbGVtZW50LnRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICAgICAgICB0bXAgPSB0aGlzLmV4dHJhY3RGcm9tU2VsZWN0KGRvbUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2tib3hcbiAgICAgICAgaWYgKGRvbUVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgdG1wID0gdGhpcy5leHRyYWN0RnJvbUNoZWNrYm94KGRvbUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3ZlcnJpZGUgdmFsdWVzXG4gICAgICAgIGlmICh0bXAgIT09IG51bGwgJiYgdG1wKSB7XG4gICAgICAgICAgICBmaWx0ZXJUeXBlID0gdG1wLnR5cGU7XG4gICAgICAgICAgICBmaWx0ZXJWYWwgPSB0bXAudmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBmb3JtRmllbGQsXG4gICAgICAgICAgICB0eXBlOiBmaWx0ZXJUeXBlLFxuICAgICAgICAgICAgdmFsOiBmaWx0ZXJWYWwsXG4gICAgICAgICAgICBuYW1lOiBmaWx0ZXJOYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGlucHV0XG4gICAgICogQHJldHVybnMge3t2YWw6IHN0cmluZywgdHlwZTogc3RyaW5nfX1cbiAgICAgKi9cbiAgICBleHRyYWN0RnJvbURhdGVSYW5nZShkb21FbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcklucHV0ID0gJChkb21FbGVtZW50KTtcbiAgICAgICAgY29uc3QgZmlsdGVySW5wdXROYW1lID0gZmlsdGVySW5wdXQuYXR0cignbmFtZScpO1xuXG4gICAgICAgIC8vIElzIGEgZGF0ZSByYW5nZVxuICAgICAgICBjb25zdCBmaWx0ZXJUeXBlID0gJ2RhdGUtcmFuZ2UnO1xuICAgICAgICBjb25zdCBwcmltYXJ5TmFtZSA9IGZpbHRlcklucHV0TmFtZS5yZXBsYWNlKCdbZnJvbV0nLCAnJykucmVwbGFjZSgnW3RvXScsICcnKTtcbiAgICAgICAgY29uc3QgZGF0ZXMgPSBbXG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiJyArIHByaW1hcnlOYW1lICsgJ1tmcm9tXVwiXScpLnZhbCgpIHx8IG51bGwsXG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiJyArIHByaW1hcnlOYW1lICsgJ1t0b11cIl0nKS52YWwoKSB8fCBudWxsXG4gICAgICAgIF0uZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCAhPT0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZmlsdGVyVmFsID0gZGF0ZXMuam9pbignIC0gJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IGZpbHRlclR5cGUsXG4gICAgICAgICAgICB2YWw6IGZpbHRlclZhbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGV4dHJhY3RGcm9tU2VsZWN0KGRvbUVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgZmlsdGVyVHlwZSA9ICdzZWxlY3QnO1xuICAgICAgICBjb25zdCBmaWx0ZXJWYWwgPSBBcnJheS5mcm9tKGRvbUVsZW1lbnQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSA/IG9wdGlvbi5pbm5lckhUTUwgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50ICE9PSBudWxsO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCcsICcpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBmaWx0ZXJUeXBlLFxuICAgICAgICAgICAgdmFsOiBmaWx0ZXJWYWxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXZWlyZCwgaXQgc2hvdWxkIGRlZmluaXRseSBiZSBZZXMgYXQgYWxsIHRpbWUgYXQgdGhpcyBwb2ludFxuICAgICAqXG4gICAgICogQHBhcmFtIGRvbUVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7e3ZhbDogKHN0cmluZyksIHR5cGU6IHN0cmluZ319XG4gICAgICovXG4gICAgZXh0cmFjdEZyb21DaGVja2JveChkb21FbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlclZhbCA9ICQoZG9tRWxlbWVudCkuaXMoJzpjaGVja2VkJykgPyAoJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKSA9PT0gJ2ZyJyA/ICdPdWknIDogJ1llcycpIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICB2YWw6IGZpbHRlclZhbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgZmlsdGVycyBsYWJlbHMgZnJvbSB0aGUganNvblxuICAgICAqL1xuICAgIGRpc3BsYXlGaWx0ZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGFjdGl2ZUZpbHRlckxpc3QuZW1wdHkoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5maWx0ZXJPYmplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRGaWx0ZXIgPSB0aGlzLmZpbHRlck9iamVjdFtpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkQWN0aXZlRmlsdGVyKGN1cnJlbnRGaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIEFjdGl2ZSBGaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmlkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMudHlwZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmxhYmVsXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMudmFsXG4gICAgICovXG4gICAgYWRkQWN0aXZlRmlsdGVyKG9wdHMpIHtcbiAgICAgICAgY29uc3QgaWQgPSBvcHRzLmlkO1xuICAgICAgICBjb25zdCB0eXBlID0gb3B0cy50eXBlO1xuICAgICAgICBjb25zdCBsYWJlbCA9IG9wdHMubmFtZTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvcHRzLnZhbDtcblxuICAgICAgICBjb25zdCBsaXN0SXRlbSA9ICQoJzxsaT48L2xpPicpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnbGFiZWwnKS50ZXh0KGxhYmVsKS5hdHRyKCd0aXRsZScsIGxhYmVsKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCd2YWx1ZScpLnRleHQodmFsdWUpLmF0dHIoJ3RpdGxlJywgdmFsdWUpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdyZW1vdmUgZmEgZmEtdGltZXMganMtcmVtb3ZlLWZpbHRlcicpKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEta2V5JywgaWQpXG4gICAgICAgICAgICAuYXR0cignZGF0YS10eXBlJywgdHlwZSk7XG4gICAgICAgICQodGhpcy4kYWN0aXZlRmlsdGVyTGlzdCkuYXBwZW5kKGxpc3RJdGVtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgaXRlbSBmcm9tIGFjdGl2ZSBmaWx0ZXIgbGlzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGRvbUVsZW1lbnQgUmVtb3ZlIEV2ZW50IG9yIHRhcmdldCBzdHJpbmcuXG4gICAgICovXG4gICAgcmVtb3ZlQWN0aXZlRmlsdGVyKGRvbUVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGZpbHRlcl9yZWNhcCA9IHRoaXM7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBmaWx0ZXJzIGlmIGRvbUVsZW1lbnQgaXMgdW5kZWZpbmVkLlxuICAgICAgICBpZiAodHlwZW9mIGRvbUVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkKCdsaScsIGZpbHRlcl9yZWNhcC4kYWN0aXZlRmlsdGVyTGlzdCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJfcmVjYXAucmVtb3ZlTGlzdEl0ZW0odGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBkb21FbGVtZW50IGZyb20gdGhlIGFjdGl2ZSBmaWx0ZXIgbGlzdC5cbiAgICAgICAgZmlsdGVyX3JlY2FwLnJlbW92ZUxpc3RJdGVtKGRvbUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJlbW92ZUxpc3RJdGVtKGRvbUVsZW1lbnQpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGRvbUVsZW1lbnQgZnJvbSB0aGUgYWN0aXZlIGZpbHRlciBsaXN0LlxuICAgICAgICBjb25zdCBsaXN0SXRlbSA9ICQoZG9tRWxlbWVudCkuY2xvc2VzdCgnbGknKTtcblxuICAgICAgICBpZiAobGlzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5jbGVhckZpbHRlcihsaXN0SXRlbSk7XG4gICAgICAgICAgICBsaXN0SXRlbS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWR2YW5jZWRTZWFyY2hGaWx0ZXJSZWNhcDsiLCIvKiBnbG9iYWwgQ2hhcmNvYWwgKi9cbmltcG9ydCBBZHZhbmNlZFNlYXJjaCBmcm9tIFwiLi9hZHZhbmNlZC1zZWFyY2hcIjtcblxuOyhmdW5jdGlvbiAoKSB7XG4gICAgQ2hhcmNvYWwuQWRtaW4uV2lkZ2V0X0FkdmFuY2VkX1NlYXJjaCAgICAgID0gQWR2YW5jZWRTZWFyY2g7XG4gICAgQ2hhcmNvYWwuQWRtaW4uV2lkZ2V0X0FkdmFuY2VkX1NlYXJjaF9UYWJzID0gQWR2YW5jZWRTZWFyY2g7XG59KGpRdWVyeSkpO1xuIl19
