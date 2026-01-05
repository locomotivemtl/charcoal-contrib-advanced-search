class AdvancedSearchFilterRecap {
  constructor($form, $activeFilterList, parent) {
    this.$form = $form;
    this.$activeFilterList = $activeFilterList;
    this.filterObject = void 0;
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
    $("input, select", this.$form).each(function(i, current) {
      if (!current.value) {
        return true;
      }
      if (current.type === "checkbox" && !$(current).is(":checked")) {
        return true;
      }
      const value = that.extractLabelAndValueFromInput(current);
      if (!value) {
        return;
      }
      if (!formFieldIds.includes(value.id)) {
        formFieldIds.push(value.id);
        output.push(value);
      }
    });
    this.filterObject = output;
  }
  extractLabelAndValueFromInput(domElement) {
    let tmp = null;
    const $domElement = $(domElement);
    let formField = $domElement.attr("id");
    let filterVal = $domElement.val();
    let filterType = "input";
    const filterWrapper = $domElement.closest("fieldset");
    const filterName = $("label", filterWrapper).first().text();
    const inputName = $domElement.attr("name");
    if (typeof inputName === "undefined") {
      return false;
    }
    if (inputName.endsWith("[to]") || inputName.endsWith("[from]")) {
      formField = formField.replace("from_", "").replace("to_", "");
      tmp = this.extractFromDateRange(domElement);
    }
    if (domElement.tagName === "SELECT") {
      tmp = this.extractFromSelect(domElement);
    }
    if (domElement.type === "checkbox") {
      tmp = this.extractFromCheckbox(domElement);
    }
    if (domElement.classList.contains("selectized")) {
      filterVal = domElement.parentElement.querySelector(".selectize-input .item").textContent;
    }
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
    const filterInputName = filterInput.attr("name");
    const filterType = "date-range";
    const primaryName = filterInputName.replace("[from]", "").replace("[to]", "");
    const dates = [
      $('input[name="' + primaryName + '[from]"]').val() || null,
      $('input[name="' + primaryName + '[to]"]').val() || null
    ].filter(function(element) {
      return element !== null;
    });
    const filterVal = dates.join(" - ");
    return {
      type: filterType,
      val: filterVal
    };
  }
  extractFromSelect(domElement) {
    const filterType = "select";
    const filterVal = Array.from(domElement.selectedOptions).map(function(option) {
      return option.value ? option.innerHTML : null;
    }).filter(function(element) {
      return element !== null;
    }).join(", ");
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
    const filterVal = $(domElement).is(":checked") ? $("html").attr("lang") === "fr" ? "Oui" : "Yes" : "";
    return {
      type: "checkbox",
      val: filterVal
    };
  }
  /**
   * Display filters labels from the json
   */
  displayFilters() {
    if (this.filterObject === void 0) {
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
    const listItem = $("<li></li>").append($("<span></span>").addClass("label").text(label).attr("title", label)).append($("<span></span>").addClass("value").text(value).attr("title", value)).append($("<div></div>").addClass("remove fa fa-times js-remove-filter")).attr("data-key", id).attr("data-type", type);
    $(this.$activeFilterList).append(listItem);
  }
  /**
   * Remove item from active filter list.
   *
   * @param {Element|string} domElement Remove Event or target string.
   */
  removeActiveFilter(domElement) {
    var filter_recap = this;
    if (typeof domElement === "undefined") {
      $("li", filter_recap.$activeFilterList).each(function() {
        filter_recap.removeListItem(this);
      });
      return;
    }
    filter_recap.removeListItem(domElement);
  }
  removeListItem(domElement) {
    const listItem = $(domElement).closest("li");
    if (listItem.length) {
      this.parent.clearFilter(listItem);
      listItem.remove();
    }
  }
}
const widgetL10n = window.widgetL10n || {};
const $$1 = jQuery;
class AdvancedSearch extends Charcoal.Admin.Widget {
  constructor(opts) {
    if (!opts.data.properties_options) {
      opts.data.properties_options = {};
    }
    super(opts);
    Charcoal.Admin.Widget.call(this, opts);
  }
  init() {
    this.$form = this.element();
    this.$applyBtn = $$1(".js-filter-apply", this.$form);
    this.$exportBtn = $$1(".js-filter-export", this.$form);
    this.$sortBtn = $$1(".sort-dropdown", this.$form);
    this.$activeFilterList = $$1(".active-filters", this.$form);
    this.totalRows = 0;
    this.isReloading = false;
    this.clearOnEmpty = false;
    this.filterRecap = new AdvancedSearchFilterRecap(this.$form, this.$activeFilterList, this);
    this.$form.on("submit.charcoal.search.filter", (function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.submit();
    }).bind(this));
    const that = this;
    this.$activeFilterList.on("click", ".js-remove-filter", function(e) {
      that.filterRecap.removeActiveFilter(e.target);
      if (that.countChanges() === 0 && that.clearOnEmpty) {
        that.clear();
      }
    });
    this.$form.on("click.charcoal.search.filter", ".js-filter-reset", this.clear.bind(this));
    this.$form.on(
      "click.charcoal.search.filter",
      ".sort-dropdown + .dropdown-menu>.dropdown-item",
      this.sort.bind(this)
    );
    $$1(".c-filters-tab").on("click", function() {
      const tab_key = $$1(this).attr("data-tab");
      $$1(".c-filters-tab").removeClass("active");
      $$1(".c-filters-tab button i").addClass("fa-angle-down");
      $$1(this).addClass("active");
      $$1("button i", this).removeClass("fa-angle-down").addClass("fa-angle-up");
      $$1(".c-filter-group.active").removeClass("active");
      $$1('.c-filter-group[data-tab="' + tab_key + '"]').addClass("active");
    });
    if ($$1(".c-filters-tab.active").length === 0) {
      $$1(".c-filters-tab").first().click();
    }
    const widget = this;
    $$1(this.$exportBtn).on("click", function() {
      widget.export();
      return false;
    });
    this.$form.on("change", "input, select", (e) => widget.onFieldChange(e));
    $$1(".datetimepickerinput", this.$form).on("change.datetimepicker", (e) => widget.onFieldChange(e));
    $$1($$1("input:not([type=hidden]), select:not([type=hidden])", this.$form)[0]).trigger("change");
    if (this.countActiveFilters() > 0) {
      this.clearOnEmpty = true;
      const manager = Charcoal.Admin.manager();
      manager.ready(() => {
        const widgets = manager.components.widgets;
        if (widgets.length > 0) {
          widgets.forEach((function(widget2) {
            if (!widget2 || typeof widget2.set_filters !== "function") {
              return this;
            }
            const total_rows = widget2.opts("data").total_rows ?? null;
            if (total_rows !== null) {
              this.setTotalRows(total_rows);
            }
          }).bind(this));
        }
      });
    }
  }
  onFieldChange(e) {
    const widget = this;
    const targetFilter = e.target;
    let formField = $$1(targetFilter).attr("id");
    let filterVal = $$1(targetFilter).val();
    let filterName = $$1(targetFilter).attr("name");
    if (!filterName && typeof e.date === "undefined") {
      return;
    }
    if (e.target.type === "checkbox") {
      filterVal = $$1(targetFilter).is(":checked") ? "checked" : "";
    }
    if (typeof e.date !== "undefined") {
      const filterInput = $$1("input", targetFilter).first();
      const filterInputName = filterInput.attr("name");
      formField = filterInput.attr("id");
      if (filterInputName.endsWith("[to]") || filterInputName.endsWith("[from]")) {
        const primaryName = filterInputName.replace("[from]", "").replace("[to]", "");
        const dates = [
          $$1('input[name="' + primaryName + '[from]"]').val() || null,
          $$1('input[name="' + primaryName + '[to]"]').val() || null
        ].filter(function(element) {
          return element !== null;
        });
        filterVal = dates.join(" - ");
      } else {
        filterVal = filterInput.val();
      }
    }
    if (!filterVal.length) {
      widget.removeActiveFilter(formField);
      if (!$$1(targetFilter).is("input, select")) {
        $$1(targetFilter).find(".changed").removeClass("changed");
      } else {
        $$1(targetFilter).removeClass("changed");
      }
    } else {
      if (!$$1(targetFilter).is("input, select")) {
        $$1(targetFilter).find("input, select").addClass("changed");
      } else {
        $$1(targetFilter).addClass("changed");
      }
    }
    widget.filterRecap.refresh();
    if (widget.countChanges() === 0 && widget.clearOnEmpty) {
      widget.clear();
    }
  }
  /**
   * Count total active filters.
   *
   * @returns {int} Total active filters.
   */
  countActiveFilters() {
    return $$1("li", this.$activeFilterList).length;
  }
  /**
   * Clean filter ID of 'from'/'to'.
   *
   * @param {string} filterId
   * @returns
   */
  cleanFilterId(filterId) {
    let filterIdClean = filterId;
    if (filterId.includes("from_input_") || filterId.includes("to_input_")) {
      filterIdClean = filterIdClean.replace("from_", "").replace("to_", "");
    }
    return filterIdClean;
  }
  /**
   * Remove item from active filter list.
   *
   * @param {string} target Remove Event or target string.
   */
  removeActiveFilter(target) {
    if (typeof target === "undefined") {
      this.filterRecap.removeActiveFilter();
      return;
    }
    target = this.cleanFilterId(target);
    target = $$1('li[data-key="' + target + '"]', this.$activeFilterList);
    this.filterRecap.removeActiveFilter(target.get(0));
  }
  setTotalRows(totalRows) {
    this.totalRows = totalRows;
    const totalRowsEl = $$1(".filters-total-rows").first();
    totalRowsEl.find(".row-count").text(this.totalRows);
    totalRowsEl.attr("data-count", this.totalRows);
  }
  /**
   * Count all changed filters.
   *
   * @returns {int} Change count.
   */
  countChanges() {
    const changeCount = $$1("input.changed, select.changed", this.$form).length;
    const hasChanges = changeCount > 0;
    const changeCountString = hasChanges ? "(" + changeCount + ")" : "";
    $$1(".js-filter-apply, .js-filter-reset, .js-filter-export", this.$form).prop("disabled", !hasChanges);
    $$1(".btn-label span.active", this.$applyBtn).removeClass("active");
    $$1(".btn-label span.active", this.$exportBtn).removeClass("active");
    $$1(changeCount === 1 ? ".btn-label-singular" : ".btn-label-plural", this.$applyBtn).addClass("active");
    $$1(".filter-apply-count", this.$applyBtn).text(changeCountString);
    $$1(".c-filter-group").each(function() {
      const tabChangeCount = $$1("input.changed, select.changed", this).length;
      const tabFilterCountEl = $$1('.c-filters-tab[data-tab="' + $$1(this).data("tab") + '"] .tab-filter-count');
      tabFilterCountEl.attr("data-count", tabChangeCount);
      tabFilterCountEl.find(".count").text(tabChangeCount);
    });
    return changeCount;
  }
  /**
   * Resets the filter widgets.
   *
   * @return this
   */
  clear() {
    this.removeActiveFilter();
    this.$form.find("select").each((index, item) => {
      $$1(item).val("");
      $$1(item).selectpicker("deselectAll");
    });
    $$1(".datetimepickerinput").each(function() {
      if ($$1(".datetimepicker-input", this).val().length) {
        $$1(this).datetimepicker("clear");
      }
    });
    $$1(".changed", this.$form).removeClass("changed");
    $$1("input, select", this.$form).prop("required", false);
    this.countChanges();
    $$1("li", this.$activeFilterList).remove();
    $$1(this.$sortBtn).removeClass("selected");
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
    if (!$$1(listItem).length) {
      return;
    }
    const filterId = $$1(listItem).data("key");
    const listItemType = $$1(listItem).data("type");
    let filterInput, filterType;
    if (listItemType.includes("date")) {
      if (listItemType === "date-range") {
        filterType = "date-range";
        filterInput = $$1("#from_" + filterId, this.$form);
      } else {
        filterType = "date";
        filterInput = $$1("#" + filterId, this.$form);
      }
    } else {
      filterInput = $$1("#" + filterId, this.$form);
      filterType = filterInput.length ? filterInput[0].type : "unknown";
    }
    switch (filterType) {
      case "checkbox":
        filterInput.prop("checked", false);
        break;
      case "select-one":
      case "select-multiple":
        $$1(filterInput).val("");
        $$1(filterInput).selectpicker("refresh");
        break;
      case "date-range":
        filterInput.closest("fieldset").find(".datetimepickerinput").datetimepicker("clear");
        filterInput.closest("fieldset").find(".changed").removeClass("changed");
        break;
      default:
        filterInput.val("");
        break;
    }
    $$1(filterInput).removeClass("changed");
    return this;
  }
  /**
   * Change the widget sorting order.
   *
   * @param {object} e Event.
   * @return this
   */
  sort(e) {
    const optionEl = $$1(e.target).closest(".dropdown-item");
    const label = $$1(".btn-label", optionEl).text();
    if ($$1(optionEl).hasClass("default")) {
      $$1(this.$sortBtn).removeClass("selected");
    } else {
      $$1(this.$sortBtn).addClass("selected").data({
        property: optionEl.data("property"),
        direction: optionEl.data("direction")
      });
      $$1(".sort-option", this.$sortBtn).find(".sort-option-value").text(label);
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
    const formField = $$1(input).closest(".form-field");
    const dataOperator = formField.data("operator") || "";
    this.name = name;
    this.value = value;
    this.operator = "=";
    this.type = input.type;
    this.parseInvalidBetween = function(name2, value2) {
      this.type = "date";
      this.value = value2;
      this.operator = name2.endsWith("[from]") ? ">" : "<";
    };
    if (dataOperator.length) {
      this.operator = dataOperator;
    }
    if (this.type === "text" && this.operator === "LIKE") {
      this.value = "%" + this.value + "%";
    }
    if (this.type === "checkbox") {
      this.value = input.checked;
    }
    if (this.type === "select-multiple") {
      this.value = $$1(input).val();
      if (this.operator !== "FIND_IN_SET") {
        this.operator = "IN";
      }
    }
    if (name.endsWith("[from]") || name.endsWith("[to]")) {
      this.type = "daterange";
      this.operator = "BETWEEN";
      this.matching = name.endsWith("[from]") ? name.replace("[from]", "[to]") : name.replace("[to]", "[from]");
      const matching_value = $$1('input[name="' + this.matching + '"]').val();
      if (!this.value.length || !matching_value.length) {
        if (!this.value.length) {
          this.parseInvalidBetween(this.matching, matching_value);
        } else {
          this.parseInvalidBetween(this.name, this.value);
        }
      }
    }
    return this;
  }
  /**
   * Submit the filters to all widgets.
   *
   * @return this
   */
  submit() {
    let fields, filters = [], manager, widgets, request;
    const that = this;
    manager = Charcoal.Admin.manager();
    widgets = manager.components.widgets;
    if (widgets.length > 0) {
      this.$form.serializeArray();
      fields = this.$form.find(":input.changed");
      $$1.each(fields, function(i, field) {
        if (!!field.value) {
          filters.push(that.filterObj(field, field.name, field.value));
        }
      });
      this.clearOnEmpty = filters.length > 0;
      request = this.prepare_request(filters);
      widgets.forEach((function(widget) {
        this.dispatch(request, widget);
      }).bind(this));
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
      fields = this.$form.find(":input.changed");
      $$1.each(fields, function(i, field) {
        if (!!field.value) {
          filters.push(that.filterObj(field, field.name, field.value));
        }
      });
      request = this.prepare_request(filters);
      widgets.forEach((function(widget) {
        if (typeof widget.set_filters !== "function") {
          return;
        }
        data = {
          widget_type: widget.widget_type(),
          widget_options: widget.widget_options(),
          with_data: true
        };
        const filters2 = [];
        if (request.filters) {
          filters2.push(request.filters);
        }
        const orders = [];
        if (request.orders) {
          orders.push(request.orders);
        }
        data.widget_options.collection_config.filters = filters2 || {};
        data.widget_options.collection_config.orders = orders || {};
      }).bind(this));
      const url = Charcoal.Admin.admin_url() + "advanced-search/export" + window.location.search;
      $$1(this.$form).addClass("loading");
      this.reloadXHR = $$1.ajax({
        type: "POST",
        url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json"
      });
      let success, failure, complete;
      success = function(response) {
        if (typeof response.widget_id !== "string") {
          response.feedbacks.push({
            level: "error",
            message: widgetL10n.loadingFailed
          });
          failure.call(this, response);
          return;
        }
        const wid = response.widget_id;
        that.set_id(wid);
        that.add_opts("id", wid);
        that.add_opts("widget_id", wid);
        that.widget_id = wid;
        if (typeof response.file !== "string") {
          response.feedbacks.push({
            level: "error",
            message: widgetL10n.loadingFailed
          });
          failure.call(this, response);
          return;
        }
        window.location.href = Charcoal.Admin.admin_url() + "advanced-search/download?filename=" + response.file;
      };
      failure = function(response) {
        if (response.feedbacks.length) {
          Charcoal.Admin.feedback(response.feedbacks);
        } else {
          Charcoal.Admin.feedback([{
            level: "error",
            message: widgetL10n.loadingFailed
          }]);
        }
      };
      complete = function() {
        if (!that.suppress_feedback()) {
          Charcoal.Admin.feedback().dispatch();
        }
        $$1(that.$form).removeClass("loading");
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
    let request = null, filters = [], opts;
    const data = this.opts("data");
    const orderProperty = $$1(this.$sortBtn).data("property");
    const collection_table = this.opts("collection_table");
    p_filters.forEach(function(filter_obj) {
      const propName = filter_obj.name.replace(/(\[.*)/gi, "");
      let filter_table = null;
      let value_override = [];
      opts = data.properties_options[propName] || {};
      if (typeof opts.table !== "undefined" && opts.table !== collection_table) {
        filter_table = opts.table || null;
      }
      if (typeof filter_obj !== "undefined") {
        if (filter_obj.type === "daterange") {
          if (filter_obj.operator === "BETWEEN" && filter_obj.name.endsWith("[to]")) {
            return false;
          }
          const matching_value = $$1('input[name="' + filter_obj.matching + '"]').val();
          if (filter_obj.name.endsWith("[from]")) {
            value_override = [filter_obj.value, matching_value];
          } else {
            value_override = [matching_value, filter_obj.value];
          }
        }
      }
      filters.push({
        conjunction: opts.conjunction || "AND",
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
        filters,
        name: "advanced-search",
        table: collection_table
      };
    }
    if ($$1(this.$sortBtn).hasClass("selected") && orderProperty) {
      request.orders = {
        direction: $$1(this.$sortBtn).data("direction"),
        mode: $$1(this.$sortBtn).data("direction"),
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
    if (this.isReloading || !widget || typeof widget.set_filters !== "function") {
      return this;
    }
    if (typeof widget.pagination !== "undefined") {
      widget.pagination.page = 1;
    }
    const filters = [];
    filters.push({
      conjunction: "AND",
      name: "isAdvancedSearch",
      condition: "(1 = 1)"
    });
    if (request.filters) {
      filters.push(request.filters);
    }
    widget.set_filters(filters);
    const orders = [];
    if (request.orders) {
      orders.push(request.orders);
    }
    $$1(this.$form).addClass("loading");
    this.isReloading = true;
    widget.set_orders(orders);
    const site_search = this.opts("site_search");
    if (site_search.length > 0) {
      var search_widget = Charcoal.Admin.manager().get_widget(site_search);
      if (typeof widget.set_search_query === "function") {
        search_widget.set_search_query(search_widget.$input.val());
        widget.set_search_query(search_widget.search_query());
      }
      if (typeof widget.set_filter === "function") {
        widget.set_filter("search", search_widget.search_filters());
      }
    }
    widget.reload((function(response) {
      if (response) {
        this.setTotalRows(response.widget_data.total_rows);
      }
      $$1(this.$form).removeClass("loading");
      this.isReloading = false;
    }).bind(this), true);
    return this;
  }
}
(function() {
  Charcoal.Admin.Widget_Advanced_Search = AdvancedSearch;
  Charcoal.Admin.Widget_Advanced_Search_Tabs = AdvancedSearch;
})(jQuery);
//# sourceMappingURL=advanced-search.js.map
