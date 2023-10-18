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

        // Clear everything if that was the last filter.
        if (this.clearOnEmpty && this.countChanges() === 0) {
          this.clear();
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
      widget.countChanges();
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
      this.$form[0].reset();

      // Clear selects
      this.$form.find('select').each(function (index, item) {
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

},{"./advanced-search":1}]},{},[3]);
