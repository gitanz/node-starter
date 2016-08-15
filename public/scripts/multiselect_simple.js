(function ($) {
    var $myEl;
    var self = {
        _extendDefaults: function (options) {
            return $.extend({}, $.fn.defaults, options);
        },
        _initialize: function ($selectEl) {
            $selectEl.addClass(self.config.oldHideClassName);
            var valueArray = $selectEl.find('option').map(self._getValueFromOption);
            var $newSelect = self._buildUlLi(valueArray);
            var $parentDiv = $("<div data-toggle='tooltip' data-placement='top' data-trigger='manual' title='' " +
            "data-original-title='" + $.fn.multiSelectDefaults.tooltipTitle +"'/>").addClass(self.config.parentDivClass);
            var $searchField = $("<input type='text' width='auto' class='search-text-field' data-action='showDropdown' style='width:10px'>");
            var $selectedItems = $("<ul class='" + self.config.selectedItemsClass + "'/>");
            var $searchDiv = $("<div class='" + self.config.searchDivClass + "' data-trigger='focusInput'/>").append($selectedItems, $searchField);
            var $utilButtonApply = "";
            if( $.fn.multiSelectDefaults.hasApplyButton){
                $utilButtonApply = $("<button type='button' class='btn btn-success' data-action='applySelection'>" + $.fn.multiSelectDefaults.apply +"</button>");
            }
            var $utilButtonClear = $("<button type='button' class='btn hide' data-action='cancelSelection' >Clear</button>");
            var $utilButtonCancel = $("<button type='button' class='btn btn-default' data-action='hideDropdown' >" + $.fn.multiSelectDefaults.cancel +"</button>");
            var $clearDiv = $("<div style='clear:both'/>");
            var $utilDiv = $("<div class='utilDiv'/>").append($utilButtonApply, $utilButtonClear, $utilButtonCancel, $clearDiv);
            var $dropdown = $("<div class='multi-select-dropdown'></div>");
            //var $button = $("<button data-action='toggleDropdown'>▼</button>");
            //$searchDiv.append($button);
            $dropdown.append($newSelect, $utilDiv);
            $parentDiv.append($searchDiv, $dropdown);

            $selectEl.after($parentDiv);

            var $baseDiv = $(".multi-select-simple");

            self._bindTriggeredActions($baseDiv);

            self._registerAllTriggers($baseDiv);

            self._bindClickActions($baseDiv);

            self.methods.showPlaceholder();

            if (!!$.fn.multiSelectDefaults.onLoadSetValue) {
                var $setElement = $baseDiv.find(".multi-select-ul li[data-value='" + $.fn.multiSelectDefaults.onLoadSetValue + "']");
                self.methods.selectElement($setElement);
                self.methods.hideDropdown();
                self.methods.unfocusInput();
            }


        },
        _registerAllTriggers: function ($baseDiv) {
            $("body").on("click", function (e) {
                if ($(e.target).closest(".multi-select-simple").length > 0) {
                    $("[data-toggle='tooltip']").tooltip('show');
                    return;
                }

                $("[data-toggle='tooltip']").tooltip('hide');
                self.methods.hideDropdown();
                if (self.methods.countSelected() < 1) {
                    self.methods.showPlaceholder();
                }
            });
            $baseDiv.on("focusInput", self.triggerHandlers.focusInput);
            $(".search-text-field").on("keydown", self.triggerHandlers.handleKeydown);
            $(".search-text-field").on("keyup", self.triggerHandlers.handleKeyup);
            $myEl.on("refreshSelection", function(){
                self.triggerHandlers.refreshSelect();
            })
        },
        _bindTriggeredActions: function ($baseDiv) {
            $baseDiv.on("click", "[data-trigger]", function (e) {
                var $target = $(e.target);
                if ($target.data().hasOwnProperty("trigger")) {
                    $(this).trigger($(this).data("trigger"));
                }
            });
            $("input.search-text-field").on("focus", function () {
                self.methods.hidePlaceholder();
            });
            $("input.search-text-field").on("focusout", function () {
                $(this).val("");
                $(".search-div").removeClass("focus");
            });

        },
        _bindClickActions: function ($baseDiv) {
            $baseDiv.on("click", "[data-action]", function (e) {
                var $target = $(e.target);
                if ($target.data().hasOwnProperty("action")) {
                    if (typeof(self.methods[$target.data("action")]) != typeof (undefined)) {
                        // console.log("finding method "+$target.data("action"));
                        self.methods[$target.data("action")]($target);
                    }
                    else {
                        throw("No such '" + $target.data("action") + "' method defined in self.method! Define one to have action");
                    }
                } else {

                }
            });
        },
        _getValueFromOption: function () {
            $option = $(arguments[1]);
            var rObj = {};
            rObj[$option.val()] = $option.html();
            return rObj;
        },
        _buildUlLi: function (valueArray) {
            $ul = $("<ul/>").addClass(self.config.selectableUlClass);
            for (i = 0; i < valueArray.length; i++) {
                $li = $("<li/>").addClass(self.config.selectableLiClass);
                $.each(valueArray[i], function (key, value) {
                    $li.attr("data-value", key);
                    $li.attr("data-action", "selectElement");
                    $li.append(value);
                });
                $ul.append($li);
            }
            return $ul;
        }
    };

    self.triggerHandlers = {
        focusInput: function () {
            self.methods.focusInput();
        },
        handleKeydown: function (event) {
            console.log(event.keyCode);

            setWidth = $("input.search-text-field").width();

            if (event.keyCode == 8) {

                setWidth = $("input.search-text-field").width() - 7;
                $("input.search-text-field").val().length < 1 && self.methods.editLastSelection() && event.preventDefault();
            }

            if ($.inArray(event.keyCode, [32, 188, 13]) != -1) {
                event.preventDefault();
                var ok = self.methods.selectFirstFoundElement();
                setWidth = ok == true ? 10 : setWidth;

            }

            if (event.keyCode >= 48 && event.keyCode <= 57)
                setWidth = $("input.search-text-field").width() + 7;

            if (event.keyCode >= 65 && event.keyCode <= 90)
                setWidth = $("input.search-text-field").width() + 7;

            if (event.keyCode >= 96 && event.keyCode <= 105)
                setWidth = $("input.search-text-field").width() + 7;

            if (setWidth < 10 && $("input.search-text-field").val().length < 1)
                setWidth = 10;

            $("input.search-text-field").width(setWidth);

        },
        handleKeyup: function (e) {
            self.methods.doSearch()
        },
        refreshSelect:function(e){
            $('ul.multi-select-ul').remove();
            var valueArray = $myEl.find('option').map(self._getValueFromOption);
            var $newSelect = self._buildUlLi(valueArray);
            $newSelect.insertBefore(".multi-select-dropdown .utilDiv");
        }
    };

    self.methods = {
        isShownPlaceholder: function () {
            return $("ul.selected-items").hasClass("placeholder");
        },
        hidePlaceholder: function () {
            if (self.methods.countSelected() == 0 && self.methods.isShownPlaceholder()) {
                $("ul.selected-items").html("");
                $("ul.selected-items").css("width", "auto");
                $("ul.selected-items").removeClass("placeholder").closest("[data-trigger='focusInput']").removeData();
                $("ul.selected-items").closest("search-div").data("trigger", "focusInput").attr("data-trigger", "focusInput");
            }
        },
        showPlaceholder: function () {
            $("input.search-text-field").val("");
            $("ul.selected-items").closest("[data-trigger='focusInput']").data("trigger", "").removeData();
            $("ul.selected-items").data("trigger", "focusInput").attr("data-trigger", "focusInput").addClass("placeholder").html($.fn.multiSelectDefaults.placeholderText);
        },
        applySelection: function () {
            self.methods.clearInput();
            self.methods.hideDropdown();
            $("body").trigger("idSelectApply");
        },
        cancelSelection: function (e) {
            $("ul.selected-items").html("");
            $myEl.find("option").prop("selected", "");
            $(".multi-select-ul li[data-action='unselectElement']").removeClass("active").data("action", "selectElement").attr("data-action", "selectElement");
            self.methods.clearInput();
            self.methods.hideDropdown();
        },
        editLastSelection: function () {
            $lastItem = $("ul.selected-items li.selection-tokens:last");
            if (!$lastItem.length)
                return;
            $element = $(".multi-select-ul li[data-action='unselectElement'][data-value='" + $lastItem.data("value") + "']");
            self.methods.unselectElement($element);
            self.methods.putItemToInput($lastItem);
            self.methods.focusInput();
            self.methods.doSearch();
        },
        putItemToInput: function ($item) {
            text = $item.find("span:last").html() + " ";
            setWidth = 10 + text.length * 7;
            $("input.search-text-field").val(text).width(setWidth);

        },
        selectFirstFoundElement: function () {
            $firstElement = $(".multi-select-ul li[data-action='selectElement']:visible:first");
            if ($firstElement.length > 0) {
                self.methods.selectElement($firstElement);
                return true;
            } else {
                return false;
            }

        },
        doSearch: function () {
            var searchText = $.trim($("input.search-text-field").val());
            self.methods.refreshList();
            if (searchText.length > 0) {
                $(".multi-select-ul li[data-action='unselectElement']").hide();
                $(".multi-select-ul li[data-action='selectElement']").not(":contains(" + searchText + ")").hide();
                $(".multi-select-ul li[data-action='selectElement']:contains(" + searchText + ")").show();
            }
            if ($(".multi-select-ul li[data-action]:visible").length < 1)
                self.methods.showNoRecordsFound();

        },
        showNoRecordsFound: function () {
            $(".multi-select-ul").append("<li class='norecords'> No records found </li>");
        },
        toggleDropdown: function () {
            if ($(".multi-select-ul").is(":visible")) {
                self.methods.hideDropdown();
                return;
            }
            self.methods.showDropdown();
        },
        showDropdown: function () {
            $(".multi-select-dropdown").show();
        },
        hideDropdown: function () {
            $(".multi-select-dropdown").hide();
        },
        focusInput: function () {
            $(".search-div").addClass("focus");
            if (self.methods.countSelected() == 0 && self.methods.isShownPlaceholder())
                self.methods.hidePlaceholder();
            $(".search-text-field").trigger("focus").trigger("click");

        },
        unfocusInput: function () {
            $(".search-text-field").focusout();
            $(".search-text-field").val("");
        },
        removeSelection: function ($element) {
            $element = $element.parent();
            $listElement = $(".multi-select-ul li[data-value='" + $element.data("value") + "']");
            self.methods.unselectElement($listElement);
            self.methods.removeFromSelectedItemsList($element.data("value"));
        },

        unselectElement: function ($element) {
            $element.attr("data-action", "selectElement").removeClass("active").data("action", "selectElement");
            self.methods.clearInput();
            self.methods.focusInput();
            self.methods.removeFromSelectedItemsList($element.data("value"), $element.html());
            $myEl.find("option[value='" + $element.data("value") + "']").prop("selected", "");
        },

        selectElement: function ($element) {
            if ($element.hasClass("active") && $(".selected-items li[data-value='" + $element.data("value") + "']").length > 0) {
                self.methods.unselectElement($element);
            }
            else {
                self.methods.clearInput();
                self.methods.focusInput();
                self.methods.refreshList();
                var count = self.methods.countSelected();

                if (count < $.fn.multiSelectDefaults.maxPermittedTokens) {
                    $element.attr("data-action", "unselectElement").addClass("active").data("action", "unselectElement");
                    self.methods.showInSelectedItemsList($element.data("value"), $element.html());
                    $myEl.find("option[value='" + $element.data("value") + "']").prop("selected", "selected");
                } else {
                    alert("You can only select 4 items");
                }
            }
        },
        countSelected: function () {
            return $(".selected-items li").length;
        },
        refreshList: function () {
            $(".multi-select-ul li.norecords").remove();
            $(".multi-select-ul li[data-action]").show();
        },
        clearInput: function () {
            $("input.search-text-field").val("");
        },
        showInSelectedItemsList: function (value, text) {
            $li = $("<li class='selection-tokens' data-value='" + value + "'><span class='remove-selection' data-action='removeSelection'>×</span><span data-action='showDropdown'> " + text + "</span></li>");
            $(".selected-items").append($li);
        },

        removeFromSelectedItemsList: function (value) {
            $(".selected-items li[data-value='" + value + "']").remove();
        }

    };
    self.config = {
        oldHideClassName: "hide-this-element",
        parentDivClass: "multi-select-simple",
        selectedItemsClass: "selected-items",
        selectableUlClass: "multi-select-ul",
        selectableLiClass: "selectable-li",
        searchDivClass: "search-div",
        searchTextFieldClass: "search-text-field"
    };
    $.extend($.fn, {
        multiselect_simple: function (options) {
            $myEl = $(this);
            $.fn.multiSelectDefaults = self._extendDefaults(options);
            var isMultipleSelectElement = $myEl.is("select[multiple]");
            if (!isMultipleSelectElement) {
                throw("This plugin requires the target element to be multiple select");
                return;
            }
            self._initialize($myEl);
        },
        multiSelectDefaults: {
            "maxPermittedTokens": 4,
            "placeholderText": "Teaser ID input",
            "onLoadSetValue": null,
            "tooltipTitle":"",
            "apply":"",
            "cancel":""
        }
    });
}(jQuery))