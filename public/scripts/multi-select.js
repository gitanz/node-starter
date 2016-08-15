(function ($) {
    $.fn.multiSelect = function (options) {

        return this.each(function () {

            var $select = $(this);

            var container = $("<div class='multi-select-container' style='width: auto'/>");

            var multiSelectSection;
            var buttonContainer;
            var selectedValues;

            var SelectionText = SelectionTextLang;

            var SelectAllText = SelectAllLang;

            var AllSelected = AllSelectedLang;

            if (options.SelectionText != null) {
                SelectionText = options.SelectionText;
            }

            if (options.AllSelected != null) {
                AllSelected = options.AllSelected;
            }

            $select.css('display', 'none');

            var data = options.data;

            var self = {
                initialize: function () {

                    $select.prop('multiple', true);


                    if (options.RelativePosition != null && options.RelativePosition != "" && options.RelativePosition.View != "" && options.RelativePosition.View != null) {

                        container.css({
                            'position': 'absolute',
                            'min-width': 200,
                            'top': $(options.RelativePosition.View).position().top + 30,
                            'left': $(options.RelativePosition.View).position().left

                        });
                    }

                    if (options.InitialDisplay != null && options.InitialDisplay != "") {
                        container.css({
                            'display': options.InitialDisplay
                        });
                    }

                    container.delegate('.multi-select-parent-li .multi-select-checkbox', 'click', self.selectChild)
                        .delegate('.multi-select-child-li .multi-select-checkbox', 'click', self.selectParent)
                        .delegate('.multi-select-parent-li .multi-select-checkbox', 'click', self.selectGrandParent)
                        .delegate('.multi-select-child-li .multi-select-checkbox', 'click', self.selectGrandParent)
                        .delegate('.button-container', 'click', self.setCSS)
                        .delegate('.multiple-select-search', 'keyup', self.SearchSelect)
                        .delegate('.selected-text-cross', 'click', self.SearchRemove)
                        .delegate('.multi-select-RejectBtn', 'click', self.ButtonRejectAction)
                        .delegate('.multi-select-AcceptBtn', 'click', self.ButtonAcceptAction)
                        .delegate('.button-container', 'click', self.showHide);

                    self.buildList();

                    $select.on("refreshList", function (event, jsonDataList) {
                        data = options.data = $.parseJSON(jsonDataList);
                        self.unCheckValue();
                        self.buildList();
                    });

                    $select.on("unCheckList", function (event) {
                        self.unCheckValue();
                    });

                    $select.on("CheckAllData", function (event) {
                        self.CheckAll();
                    });

                    $select.on("CheckSelectedData", function (event, jsonDataList) {
                        self.CheckSelected(jsonDataList);
                    });
                },
                buildList: function () {

                    container.html("");

                    buttonContainer = $('<div class="button-container"/>');

                    var button = $("<button class='form-control' style='text-align: left'>" + SelectionText + "</button>");

                    var spanSelectedText = $('<span class="selected-text"/>');

                    var spanArrow = $('<span class="button-arrow"/>');

                    //spanArrow.html("&#x25BC;");

                    buttonContainer.append(button);

                    buttonContainer.append(spanArrow);

                    buttonContainer.append(spanSelectedText);

                    multiSelectSection = $("<div class='multi-select-section'/>");

                    container.append(buttonContainer);

                    var parentUl = $("<ul class='multi-select-parent-ul'/>");

                    /*var MultipleSelectSearch = $("<li class='multi-select-search-li'/>");

                    MultipleSelectSearch.append($("<input type='text' class='form-control multiple-select-search'/>"))*/

                    var SelectAllLi = $("<li class='multi-select-parent-li'/>");

                    SelectAllLi.append($("<input type='checkbox' class='multi-select-checkbox grand-parent'/>"));

                    var SelectAllLiSpanValue = $('<span/>');

                    SelectAllLiSpanValue.text(SelectAllText);

                    SelectAllLi.append(SelectAllLiSpanValue);

                    var TopChildUl = $('<ul class="multi-select-child-ul"/>');


                    var objectKeys = Object.keys(data);

                    if (options.Level !== undefined && options.Level == 1) {

                        $.each(data, function (index, object) {

                            var parentLi = $("<li class='multi-select-child-li'/>");

                            parentLi.attr("ID", object[options.ID]);

                            parentLi.append($("<input type='checkbox' class='multi-select-checkbox parent'/>"));

                            var parentSpanValue = $('<span/>');

                            parentSpanValue.text(object[options.Type]);

                            parentLi.append(parentSpanValue);

                            TopChildUl.append(parentLi);

                            SelectAllLi.append(TopChildUl);
                        });
                    } else {

                        for (var i = 0; i < objectKeys.length; i++) {

                            var parentLi = $("<li class='multi-select-parent-li'/>");

                            parentLi.append($("<input type='checkbox' class='multi-select-checkbox parent'/>"));

                            var parentSpanValue = $('<span/>');

                            parentSpanValue.text(objectKeys[i]);

                            parentLi.append(parentSpanValue);

                            var childUl = $('<ul class="multi-select-child-ul"/>');

                            for (var j = 0; j < data[objectKeys[i]].length; j++) {

                                var childLi = $('<li class="multi-select-child-li"/>');

                                childLi.append($("<input type='checkbox' class='multi-select-checkbox child'/>"));

                                childLi.attr("ID", data[objectKeys[i]][j].ID);

                                var childSpanValue = $('<span/>');

                                childSpanValue.text(data[objectKeys[i]][j][options.Type]);

                                if (options.appendStyle != null) {
                                    childSpanValue.css("color", data[objectKeys[i]][j][options.appendStyle.colorType]);
                                }

                                childLi.append(childSpanValue);

                                childUl.append(childLi);
                            }

                            parentLi.append(childUl);

                            TopChildUl.append(parentLi);

                            SelectAllLi.append(TopChildUl);
                        }
                    }


                    //parentUl.append(MultipleSelectSearch);

                    parentUl.append(SelectAllLi);

                    if (options.ConfirmButtons != null && options.ConfirmButtons != "") {

                        var ConfirmButton = $("<div class='multi-select-confirm' ></div>");

                        var ConfirmButtonAccept = $("<div class='multi-select-accept-div'><button class='multi-select-AcceptBtn'>" + options.ConfirmButtons.Confirm + "</button></div>");
                        var ConfirmButtonReject = $("<div class='multi-select-reject-div'><button class='multi-select-RejectBtn'>" + options.ConfirmButtons.Reject + "</button></div>");

                        ConfirmButton.append(ConfirmButtonAccept);
                        ConfirmButton.append(ConfirmButtonReject);

                        parentUl.append(ConfirmButton);

                    }


                    multiSelectSection.append(parentUl);

                    container.append(multiSelectSection);



                    if (options.RelativePosition != null && options.RelativePosition != "" && options.RelativePosition.View != "" && options.RelativePosition.View != null) {
                        container.insertAfter($(options.RelativePosition.View))
                    } else {
                        container.insertAfter($select);
                    }

                    if(options.InitialChecked=="Checked"){
                        container.find("input[type='checkbox']").prop("checked",true);
                        container.find("input[type='checkbox']").addClass("multiselect-Selected");
                        self.setValue();
                    }

                },
                selectChild: function () {

                    if ($(this).is(':checked')) {
                        $(this).closest('li').find('input[type="checkbox"]:visible').prop('checked', true);
                        $(this).closest('li').find('input[type="checkbox"]:visible').addClass("multiselect-Selected");
                    } else {
                        $(this).closest('li').find('input[type="checkbox"]:visible').prop('checked', false);
                        $(this).closest('li').find('input[type="checkbox"]:visible').removeClass("multiselect-Selected");
                    }

                    self.setValue();
                    self.SetUnsetButtonValue();
                },
                selectParent: function () {
                    var allChecked = true;

                    $(this).closest('ul').find('input[type="checkbox"]').each(function () {
                        if (!$(this).is(':checked'))
                            allChecked = false;
                    });

                    if (allChecked) {
                        $(this).closest('.multi-select-parent-li').children('.multi-select-checkbox').prop('checked', true);
                    } else {
                        $(this).closest('.multi-select-parent-li').children('.multi-select-checkbox').prop('checked', false);
                    }

                    self.setValue();
                },
                selectGrandParent: function () {

                    var CheckedAll = true;

                    $(this).closest('.multi-select-parent-li').siblings().andSelf().children('.multi-select-checkbox').each(function () {
                        if (!$(this).is(':checked'))
                            CheckedAll = false;
                    });
                    if (CheckedAll) {
                        $(this).parents("div.multi-select-section").find("input[type='checkbox'][class='multi-select-checkbox grand-parent']").prop('checked', true);
                    } else {
                        $(this).parents("div.multi-select-section").find("input[type='checkbox'][class='multi-select-checkbox grand-parent']").prop('checked', false);
                    }
                },
                showHide: function (e) {
                    $('.multi-select-section').show();
                    /*if ($(e.target).is(".selected-text-cross") && $(".multi-select-section").is(":visible")) {
                        $('.multi-select-section').show();
                    } else if ($(this).hasClass("button-container") && !$(e.target).is(".selected-text-cross")) {
                        $(this).next('.multi-select-section').toggle();
                    }
*/
                },
                setValue: function () {

                    var selectedValue = [];

                    var selectedText = [];
                    if (options.Level !== undefined && options.Level == 1) {
                        container.find("ul.multi-select-child-ul").find(".multi-select-checkbox:checked").each(function () {
                            if ($(this).hasClass("multiselect-Selected")) {
                                selectedValue.push($(this).closest('li').attr('id'));
                                selectedText.push($(this).closest('li').find('span').text());
                            }

                        });
                    } else {
                        container.find(".multi-select-checkbox.child:checked").each(function () {
                            if ($(this).hasClass("multiselect-Selected")) {
                                selectedValue.push($(this).closest('li').attr('id'));
                                selectedText.push($(this).closest('li').find('span').text());
                            }
                        });
                    }
                    $select.val(selectedValue);
                    var selectedDiv = $("<div/>");

                    var maincheckbox = container.find("input[type='checkbox'][class='multi-select-checkbox grand-parent multiselect-Selected']");

                    if (maincheckbox.is(":checked") && maincheckbox.parent("li").find("input[type='checkbox']:visible:checked").length == maincheckbox.parent("li").find("input[type='checkbox']:visible").length) {

                        var tempDiv = $("<div class='selectedDiv'></div>");
                        tempDiv.append("<span class='selected-text-value'>" + AllSelected + "</span>");
                        selectedDiv.append(tempDiv);

                    } else {

                        $.each(selectedText, function (i, v) {
                            var tempDiv = $("<div class='selectedDiv'></div>");
                            tempDiv.append("<span class='selected-text-cross' >x</span>");
                            tempDiv.append("<span class='selected-text-value'>" + v + "</span>");
                            selectedDiv.append(tempDiv);

                        });
                    }


                    //container.find('.selected-text').text(selectedText.join(', '))
                    container.find('.selected-text').html('');

                    container.find('.selected-text').append(selectedDiv);
                    container.find('.selected-text').css({
                        'width': $(container).find('.selected-text').parent("div.button-container").width() - 30
                    });
                },
                getValue: function () {
                    var selectedValue = [];
                    if (options.Level !== undefined && options.Level == 1) {
                        // debugger;
                        $($select).siblings(".multi-select-container").find("ul.multi-select-child-ul").find(".multi-select-checkbox:checked").each(function () {
                            selectedValue.push(parseInt($(this).closest('li').attr('id')));
                        });
                    } else {
                        $($select).siblings(".multi-select-container").find(".multi-select-checkbox.child:checked").each(function () {
                            selectedValue.push(parseInt($(this).closest('li').attr('id')));
                        });
                    }
                    return selectedValue;
                },
                unCheckValue: function () {
                    if ($(container).find("input[type='checkbox']:checked").length > 0) {
                        $(container).find("input[type='checkbox']:checked").attr("checked", false);
                        $(container).find("button[class='form-control']").text(SelectionText);
                        $(container).find(".selected-text").text("");
                    }
                    $select.val("");
                },
                CheckAll: function () {
                    if (options.Level !== undefined && options.Level == 1) {
                        $($select).siblings(".multi-select-container").find(".multi-select-checkbox").attr("checked", "true");
                        $($select).siblings(".multi-select-container").find("ul.multi-select-child-ul").find(".multi-select-checkbox").attr("checked", "true");
                    } else {
                        $($select).siblings(".multi-select-container").find(".multi-select-checkbox.child").attr("checked", "true");
                    }
                    $(container).find("button[class='form-control']").text("");
                    self.setValue();
                },
                CheckSelected: function (jsonDataList) {
                    var dataList = $.parseJSON(jsonDataList);
                    if (!$.isArray(dataList)) return;

                    if (options.Level !== undefined && options.Level == 1) {
                        $($select).siblings(".multi-select-container").find("ul.multi-select-child-ul").find(".multi-select-checkbox").each(function () {
                            var id = parseInt($(this).closest('li').attr('id'));
                            if ($.inArray(id, dataList) != -1) {
                                $(this).attr("checked", "true");
                            }
                        });
                    } else {
                        $($select).siblings(".multi-select-container").find(".multi-select-checkbox.child").each(function () {
                            var id = parseInt($(this).closest('li').attr('id'));
                            if ($.inArray(id, dataList) != -1) {
                                $(this).attr("checked", "true");
                            }
                        });
                    }
                    $(container).find("button[class='form-control']").text("");
                    self.setValue();
                },
                SetUnsetButtonValue: function () {
                    if ($(container).find("input[type='checkbox']:checked").length == 0) {
                        $(container).find("button[class='form-control']").text(SelectionText);
                    } else
                        $(container).find("button[class='form-control']").text("");

                },
                onSelectionClose: function () {
                    if (options.onSelectionChange != null && ($($(container)).find(".multi-select-section").css('display') != 'none')) {

                        multiSelectSection.hide();
                        self.SetUnsetButtonValue();
                        options.onSelectionChange(this);

                    } else {
                        multiSelectSection.hide();
                        self.SetUnsetButtonValue();
                    }
                },
                setCSS: function () {

                    var bottom = $(window).height() - $(options.RelativePosition.View).offset().top;

                    container.css({
                        'max-width': $select.width() + 50

                    });
                    container.find(".multi-select-child-ul").css({
                        //'height': bottom - 10,
                        'max-height': 300,
                        'overflow-y': "scroll",
                        'word-break': "break-word"
                    });

                   /* if (container.children(".multi-select-section").height() > bottom) {


                        if (bottom > 500 || bottom < 0) {
                            container.find(".multi-select-child-ul").css({
                                'max-height': 400
                            });
                        }
                    }*/

                },
                SearchSelect: function () {
                    var SearchText = $(this).val();
                    $(container).find("li.multi-select-child-li").show();
                    if (SearchText != "" && $(container).find("li span:contains(" + SearchText + ")").length > 0) {

                        $(container).find("li.multi-select-child-li span").not("span:contains(" + SearchText + ")").parent("li").hide();

                    } else if (SearchText != "") {
                        $(container).find("li.multi-select-child-li").hide();
                    }
                    self.CheckForParentSelection();
                    self.setValue();

                },
                SearchRemove: function () {
                    var removeValue = $(this).parent("div.selectedDiv").find(".selected-text-value").html();

                    $.each($(container).find("li.multi-select-child-li span"), function () {
                        if ($(this).text() == removeValue) {
                            //$(this).parent("li").find("input[type='checkbox']").trigger("click");
                            //$(this).parent("li").find("input[type='checkbox']").prop("checked", false);

                            $(this).parent("li").find("input[type='checkbox']").trigger('click');
                            //self.selectChild();
                        }
                    });

                    self.setValue();


                },
                ButtonAcceptAction: function () {
                    if (options.AcceptAction != null && options.AcceptAction != "" && options.AcceptAction.hasOwnProperty("action")) {
                        options.AcceptAction.action(this);
                    } else {
                        self.setValue();
                        $('.multi-select-section').hide();
                    }

                },
                ButtonRejectAction: function () {

                    if (options.RejectAction != null && options.RejectAction != "" && options.RejectAction.hasOwnProperty("action")) {
                        options.RejectAction.action(this);
                    } else {
                        $('.multi-select-section').hide();
                    }
                },
                CloseAll: function () {
                    if (options.OuterAction != null && options.OuterAction != "") {
                        if (options.OuterAction == "CloseAll")
                            $('.multi-select-container').hide();
                    }

                },
                CheckForParentSelection: function () {

                    var lastchild = container.find("li:last").siblings("li");

                    self.CheckParent(lastchild);

                },
                CheckParent: function (lastchild) {
                    if (lastchild.find("input[type='checkbox']:visible").length == lastchild.find("input[type='checkbox']:checked:visible").length) {
                        lastchild.closest("ul").parent("li").children("input[type='checkbox']").prop("checked", true);

                    } else {
                        lastchild.closest("ul").parent("li").children("input[type='checkbox']").prop("checked", false);
                    }

                    if (lastchild.closest("ul").siblings("ul").find("li input[type='checkbox']").length > 0) {
                        $.each(lastchild.closest("ul").siblings("ul").find("li:last"), function () {
                            self.CheckSiblings($(this).siblings("li"));
                        });
                    }
                },
                CheckSiblings: function (lastChild) {


                }
            };


            self.initialize();

            $(document).mousedown(function (event) {


                if (($(event.target).closest('.multi-select-section').length == 0) && $(event.target).parents(".multi-select-container").length == 0 && $(event.target)[0] != buttonContainer.find('button')[0] && !$(event.target).is(".selected-text-cross")) {
                    if (container != null) {
                        self.onSelectionClose();
                    }
                }

                if ($(event.target).is(".selected-text-cross") && !$(".multi-select-section").is(":visible")) {
                    self.onSelectionClose();
                }

                if ($(event.target).parents(".multi-select-container").length == 0) {
                    self.CloseAll();
                }


            });
        });

    };
})(jQuery);