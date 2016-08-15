//Plugin made by Anup Nepal

(function ($) {
    $.fn.GroupByRowAjaxGrid = function (options) {

        return this.each(function () {
            var $table = $(this);
            var pageUl;

            var groupByColumnName = options.groupByColumn;
            var self = {
                initialize: function () {
                    self.createTable(0, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, 1);

                    $table.on("refreshGrid", function (event, jsonParameters) {
                        if (options.filterData != null)
                            options.filterData = self.concatJson(options.filterData, jsonParameters);
                        else
                            options.filterData = jsonParameters;

                        self.createTable(0, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, 1);
                    });

                    if (options.isSortable == null || options.isSortable) {

                        $table.find(options.tableHeading).parent('th').addClass('sorting');

                        $table.find(options.tableHeading).parent('th').bind("click", function () {
                            self.sorting(this, options.pageSize);
                        });
                    }

                    if (options.refreshEverySeconds != null) {
                        setInterval(function () {
                            self.createTable(0, options.pageSize, options.defaultSortExpression, options.defaultSortOrder, 1);
                        }, options.refreshEverySeconds * 1000);
                    }
                },
                compareObjectValue: function (object, valueToCompare) {

                    var matches = false;

                    for (var comp = 0; comp < object.length; comp++) {
                        if (object[comp].name == valueToCompare) {
                            matches = true;
                            break;
                        }
                    }

                    return matches;

                },
                createTable: function (offset, pageSize, sortExpression, sortOrder, pageNumber) {

                    if (options.hideControlDuringTableCreation != null)
                        options.hideControlDuringTableCreation.css("visibility", "hidden");

                    var parameter = {
                        'offset': offset,
                        'rowNumber': pageSize,
                        'sortExpression': sortExpression,
                        'sortOrder': sortOrder,
                        'pageNumber': pageNumber
                    };

                    if (options.filterData != null)
                        parameter = self.concatJson(parameter, options.filterData);

                    var parameterJson = null;

                    if (options.addParameterToRow != null) {
                        parameterJson = JSON.parse(parameter.param);
                    }

                    $.ajax({
                        url: options.url,
                        type: options.requestType,
                        dataType: "json",
                        data: parameter,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                            options.loadingImage.css("visibility", "visible");
                        },
                        complete: function () {
                            options.loadingImage.css("visibility", "hidden");

                            if (options.afterAjaxCallComplete != null) {
                                options.afterAjaxCallComplete();
                            }

                            if (options.afterSelfCallComplete != null) {
                                options.afterSelfCallComplete($table);
                            }
                        },
                        success: function (data) {

                            var jsonMergeRowData = {};

                            $table.find('tbody').html('');

                            if (pageUl != null)
                                pageUl.remove();

                            var groupByColumnValue = '';
                            var noOfColumns = $table.find("tr:first th").length;

                            $table.find("tr:first th").each(function () {
                                $(this).hide()
                            });

                            $.each(data.Data, function (dataIndex, item) {

                                if (groupByColumnValue == '' || groupByColumnValue != item[groupByColumnName]) {
                                    groupByColumnValue = item[groupByColumnName];

                                    var $trHead = $("<tr/>");
                                    var $th = $("<th colspan='" + noOfColumns + "'/>");
                                    $th.html(groupByColumnValue);
                                    $table.find('tbody').append($trHead).append($th);
                                }

                                var $tr = $("<tr/>");

                                $tr.attr('id', item[options.id]);

                                $table.find('thead th').each(function () {

                                    var addTd = [];
                                    var $td = $("<td/>");
                                    if ($(this).find('a').length != 0) {
                                        var fieldName = $(this).find('a').attr('field-name');
                                        var $html = item[fieldName];
                                        $td.html($html);

                                        if (options.contentAdditionalProperty != null && options.contentAdditionalProperty.length != 0) {
                                            for (var i = 0; i < options.contentAdditionalProperty.length; i++) {
                                                if (fieldName == options.contentAdditionalProperty[i].name) {
                                                    var $html = options.contentAdditionalProperty[i].control;
                                                    for (var j = 0; j < options.contentAdditionalProperty[i].properties.length; j++) {
                                                        if (options.contentAdditionalProperty[i].type == "Image") {
                                                            if (options.contentAdditionalProperty[i].properties[j].whenValue == item[fieldName]) {
                                                                var $clonedHtml = $html.clone();
                                                                $clonedHtml.addClass(options.contentAdditionalProperty[i].properties[j].value)
                                                                $td.html($clonedHtml);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        $tr.append($td);
                                    }

                                    if ($(this).find('a').length == 0 && $(this).is("[col-type]") && $(this).attr('col-type') == "postContent") {

                                        if (options.postContent != null) {

                                            var postControl;

                                            for (i = 0; i < options.postContent.length; i++) {

                                                var control = options.postContent[i].control.clone();

                                                if (options.postContent[i].properties != null) {

                                                    for (var pt = 0; pt < options.postContent[i].properties.length; pt++) {
                                                        if (options.postContent[i].properties[pt].propertyField == "this") {
                                                            if (options.postContent[i].properties[pt].setWhen != null) {

                                                                if (options.postContent[i].properties[pt].setWhen.relation == "equal") {
                                                                    if (control.attr(options.postContent[i].properties[pt].setWhen.property) == item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                        control.attr(options.postContent[i].properties[pt].property, options.postContent[i].properties[pt].propertyValue);
                                                                } else {
                                                                    if (control.attr(options.postContent[i].properties[pt].setWhen.property) != item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                        control.attr(options.postContent[i].properties[pt].property, options.postContent[i].properties[pt].propertyValue);
                                                                }

                                                            } else {
                                                                control.attr(options.postContent[i].properties[pt].property, item[options.postContent[i].properties[pt].propertyValue]);
                                                            }
                                                        } else {
                                                            if (options.postContent[i].properties[pt].setWhen != null) {

                                                                if (options.postContent[i].properties[pt].setWhen.relation == "equal") {
                                                                    if (control.attr(options.postContent[i].properties[pt].setWhen.property) == item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                        control.find(options.postContent[i].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                            options.postContent[i].properties[pt].propertyValue);
                                                                } else {
                                                                    if (control.attr(options.postContent[i].properties[pt].setWhen.property) != item[options.postContent[i].properties[pt].setWhen.propertyValue])
                                                                        control.find(options.postContent[i].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                            options.postContent[i].properties[pt].propertyValue);
                                                                }

                                                            } else {
                                                                control.find(options.postContent[i].properties[pt].propertyField).attr(options.postContent[i].properties[pt].property,
                                                                    item[options.postContent[i].properties[pt].propertyValue]);
                                                            }
                                                        }
                                                    }
                                                }

                                                if (options.postContent[i].additionalControl != null) {

                                                    for (j = 0; j < options.postContent[i].additionalControl.length; j++) {

                                                        var additionalControl = options.postContent[i].additionalControl[j].control;

                                                        if (options.postContent[i].additionalControl[j].displayedWhen.relation == "equal") {
                                                            if (item[options.postContent[i].additionalControl[j].displayedWhen.header] == options.postContent[i].additionalControl[j].displayedWhen.value) {

                                                                if (options.postContent[i].additionalControl[j].disabledWhen != null) {

                                                                    var pauseContinueDisabled = false;
                                                                    for (p = 0; p < options.postContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                        if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                            if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                                pauseContinueDisabled = true;
                                                                            } else {
                                                                                pauseContinueDisabled = false;
                                                                            }
                                                                        }
                                                                        else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                            if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                                pauseContinueDisabled = true;
                                                                            } else {
                                                                                pauseContinueDisabled = false;
                                                                            }
                                                                        }
                                                                        else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                            var dNow = new Date(options.postContent[i].additionalControl[j].disabledWhen[p].value);
                                                                            var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.postContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                            if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                                pauseContinueDisabled = true;
                                                                            else
                                                                                pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    additionalControl.prop('disabled', pauseContinueDisabled);
                                                                }

                                                                control.append(additionalControl);

                                                                if (options.postContent[i].additionalControl[j].formAction != null) {
                                                                    control.attr('action', options.postContent[i].additionalControl[j].formAction);
                                                                }
                                                            }
                                                        } else if (options.postContent[i].additionalControl[j].displayedWhen.relation == "not-equal") {
                                                            if (item[options.postContent[i].additionalControl[j].displayedWhen.header] != options.postContent[i].additionalControl[j].displayedWhen.value) {

                                                                if (options.postContent[i].additionalControl[j].disabledWhen != null) {
                                                                    var pauseContinueDisabled = false;
                                                                    for (p = 0; p < options.postContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                        if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                            if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                                pauseContinueDisabled = true;
                                                                            } else {
                                                                                pauseContinueDisabled = false;
                                                                            }
                                                                        }
                                                                        else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                            if ($.inArray(item[options.postContent[i].additionalControl[j].disabledWhen[p].header], options.postContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                                pauseContinueDisabled = true;
                                                                            } else {
                                                                                pauseContinueDisabled = false;
                                                                            }
                                                                        }
                                                                        else if (options.postContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                            var dNow = new Date(options.postContent[i].additionalControl[j].disabledWhen[p].value);
                                                                            var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.postContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                            if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                                pauseContinueDisabled = true;
                                                                            else
                                                                                pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    additionalControl.prop('disabled', pauseContinueDisabled);
                                                                }

                                                                control.append(additionalControl);

                                                                if (options.postContent[i].additionalControl[j].formAction != null) {
                                                                    control.attr('action', options.postContent[i].additionalControl[j].formAction);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }

                                                if (options.postContent[i].disabledWhen != null) {

                                                    if (options.postContent[i].disabledWhen.relation == 'equal') {

                                                        if ($.inArray(item[options.postContent[i].disabledWhen.header], options.postContent[i].disabledWhen.value) != -1) {
                                                            control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                        } else {
                                                            control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                        }
                                                    } else {
                                                        if ($.inArray(item[options.postContent[i].disabledWhen.header], options.postContent[i].disabledWhen.value) == -1) {
                                                            control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                        } else {
                                                            control.find(options.postContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                        }
                                                    }
                                                }

                                                if (options.postContent[i].append != null) {
                                                    control.attr(options.postContent[i].append.property,
                                                        control.attr(options.postContent[i].append.property)
                                                        + item[options.postContent[i].append.value] + options.postContent[i].append.text);
                                                }

                                                if (postControl == null) {
                                                    if (options.postContent[i].removeWhen == null)
                                                        postControl = control.add(control);
                                                    else {
                                                        if (options.postContent[i].removeWhen != null && $.inArray(item[options.postContent[i].removeWhen.property], options.postContent[i].removeWhen.value) == -1)
                                                            postControl = control.add(control);
                                                    }
                                                }
                                                else {

                                                    if (options.postContent[i].removeWhen == null)
                                                        postControl = postControl.add("<span>  </span>").add(control);
                                                    else {
                                                        if (item[options.postContent[i].removeWhen.property] != options.postContent[i].removeWhen.value)
                                                            postControl = postControl.add("<span>  </span>").add(control);
                                                    }
                                                }
                                            }
                                            if (postControl != null) {
                                                $td.html(postControl.clone());
                                                $tr.append($td);
                                            }
                                        }
                                    }

                                    else if ($(this).find('a').length == 0 && $(this).is("[col-type]") && $(this).attr('col-type') == "preContent" && options.preContent != null) {

                                        var preControl;

                                        var i = 0;
                                        var count = options.preContent.length;

                                        while (i < count) {

                                            var control = options.preContent[i].control.clone();

                                            if (options.preContent[i].properties != null) {

                                                for (var pt = 0; pt < options.preContent[i].properties.length; pt++) {
                                                    if (options.preContent[i].properties[pt].propertyField == "this") {
                                                        if (options.preContent[i].properties[pt].setWhen != null) {

                                                            if (options.preContent[i].properties[pt].setWhen.relation == "equal") {
                                                                if (control.attr(options.preContent[i].properties[pt].setWhen.property) == item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                    control.attr(options.preContent[i].properties[pt].property, options.preContent[i].properties[pt].propertyValue);
                                                            } else {
                                                                if (control.attr(options.preContent[i].properties[pt].setWhen.property) != item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                    control.attr(options.preContent[i].properties[pt].property, options.preContent[i].properties[pt].propertyValue);
                                                            }

                                                        } else {
                                                            control.attr(options.preContent[i].properties[pt].property, item[options.preContent[i].properties[pt].propertyValue]);
                                                        }
                                                    } else {
                                                        if (options.preContent[i].properties[pt].setWhen != null) {

                                                            if (options.preContent[i].properties[pt].setWhen.relation == "equal") {
                                                                if (control.attr(options.preContent[i].properties[pt].setWhen.property) == item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                    control.find(options.preContent[i].propertyField).attr(options.preContent[i].properties[pt].property,
                                                                        options.preContent[i].properties[pt].propertyValue);
                                                            } else {
                                                                if (control.attr(options.preContent[i].properties[pt].setWhen.property) != item[options.preContent[i].properties[pt].setWhen.propertyValue])
                                                                    control.find(options.preContent[i].propertyField).attr(options.preContent[i].properties[pt].property,
                                                                        options.preContent[i].properties[pt].propertyValue);
                                                            }

                                                        }

                                                        else if(item[options.preContent[i].properties[pt].propertyValue] != "") {
                                                            control.find(options.preContent[i].properties[pt].propertyField).attr(options.preContent[i].properties[pt].property,
                                                                item[options.preContent[i].properties[pt].propertyValue]);


                                                        }
                                                    }
                                                }
                                            }

                                            if (options.preContent[i].additionalControl != null) {

                                                for (j = 0; j < options.preContent[i].additionalControl.length; j++) {

                                                    var additionalControl = options.preContent[i].additionalControl[j].control;

                                                    if (options.preContent[i].additionalControl[j].displayedWhen.relation == "equal") {
                                                        if (item[options.preContent[i].additionalControl[j].displayedWhen.header] == options.preContent[i].additionalControl[j].displayedWhen.value) {

                                                            if (options.preContent[i].additionalControl[j].disabledWhen != null) {

                                                                var pauseContinueDisabled = false;
                                                                for (p = 0; p < options.preContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                    if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                        if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                            pauseContinueDisabled = true;
                                                                        } else {
                                                                            pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                        if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                            pauseContinueDisabled = true;
                                                                        } else {
                                                                            pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                        var dNow = new Date(options.preContent[i].additionalControl[j].disabledWhen[p].value);
                                                                        var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.preContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                        if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                            pauseContinueDisabled = true;
                                                                        else
                                                                            pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                additionalControl.prop('disabled', pauseContinueDisabled);
                                                            }

                                                            control.append(additionalControl);

                                                            if (options.preContent[i].additionalControl[j].formAction != null) {
                                                                control.attr('action', options.preContent[i].additionalControl[j].formAction);
                                                            }
                                                        }
                                                    } else if (options.preContent[i].additionalControl[j].displayedWhen.relation == "not-equal") {
                                                        if (item[options.preContent[i].additionalControl[j].displayedWhen.header] != options.preContent[i].additionalControl[j].displayedWhen.value) {

                                                            if (options.preContent[i].additionalControl[j].disabledWhen != null) {
                                                                var pauseContinueDisabled = false;
                                                                for (p = 0; p < options.preContent[i].additionalControl[j].disabledWhen.length; p++) {

                                                                    if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'equal' && !pauseContinueDisabled) {

                                                                        if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) != -1) {
                                                                            pauseContinueDisabled = true;
                                                                        } else {
                                                                            pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'not-equal' && !pauseContinueDisabled) {
                                                                        if ($.inArray(item[options.preContent[i].additionalControl[j].disabledWhen[p].header], options.preContent[i].additionalControl[j].disabledWhen[p].value) == -1) {
                                                                            pauseContinueDisabled = true;
                                                                        } else {
                                                                            pauseContinueDisabled = false;
                                                                        }
                                                                    }
                                                                    else if (options.preContent[i].additionalControl[j].disabledWhen[p].relation == 'lower-than' && !pauseContinueDisabled) {
                                                                        var dNow = new Date(options.preContent[i].additionalControl[j].disabledWhen[p].value);
                                                                        var $dateTill = new Date(dNow.getMonth() + 1 + '/' + dNow.getDate() + '/' + dNow.getFullYear() + " " + item[options.preContent[i].additionalControl[j].disabledWhen[p].header]);

                                                                        if ((Math.ceil((($dateTill - dNow) / 1000) / 60) <= 10))
                                                                            pauseContinueDisabled = true;
                                                                        else
                                                                            pauseContinueDisabled = false;
                                                                    }
                                                                }
                                                                additionalControl.prop('disabled', pauseContinueDisabled);
                                                            }

                                                            control.append(additionalControl);

                                                            if (options.preContent[i].additionalControl[j].formAction != null) {
                                                                control.attr('action', options.preContent[i].additionalControl[j].formAction);
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if (options.preContent[i].disabledWhen != null) {

                                                if (options.preContent[i].disabledWhen.relation == 'equal') {

                                                    if ($.inArray(item[options.preContent[i].disabledWhen.header], options.preContent[i].disabledWhen.value) != -1) {
                                                        if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                            control.prop('disabled', true)
                                                        } else {
                                                            control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                        }
                                                    } else {
                                                        if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                            control.prop('disabled', false)
                                                        } else {
                                                            control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                        }
                                                    }
                                                } else {
                                                    if ($.inArray(item[options.preContent[i].disabledWhen.header], options.preContent[i].disabledWhen.value) == -1) {
                                                        if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                            control.prop('disabled', true)
                                                        } else {
                                                            control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', true);
                                                        }
                                                    } else {
                                                        if (options.preContent[i].disabledWhen.propertyField == "this") {
                                                            control.prop('disabled', false)
                                                        } else {
                                                            control.find(options.preContent[i].disabledWhen.propertyField).prop('disabled', false);
                                                        }
                                                    }
                                                }
                                            }

                                            if (options.preContentType != null && options.preContentType == 'Multiple') {
                                                preControl = control;
                                            }
                                            else {
                                                if (preControl == null)
                                                    preControl = control;
                                                else {

                                                    if (options.preContent[i].removeWhen == null)
                                                        preControl = preControl.add("<span>  </span>").add(control);
                                                    else {
                                                        if (item[options.preContent[i].removeWhen.property] != options.preContent[i].removeWhen.value)
                                                            preControl = preControl.add("<span>  </span>").add(control);
                                                    }
                                                }
                                            }

                                            i++;
                                        }

                                        if (preControl != null) {
                                            $td.html(preControl.clone());
                                            $tr.append($td);
                                        }
                                    }

                                    else if ($(this).find('a').length == 0) {
                                        $tr.append($td);
                                    } else if (!addTd.hasOwnProperty($(this).find('a').attr('field-name'))) {
                                        $tr.append($td);
                                    } else if (addTd.hasOwnProperty($(this).find('a').attr('field-name')) && addTd[$(this).find('a').attr('field-name')]) {
                                        $tr.append($td);
                                    }
                                });
                                $table.find('tbody').append($tr);
                            });
                            self.createPaging(data.RowCount, pageNumber, options.pageSize);
                        }
                    });
                },
                createPaging: function (rowCount, pageNumber, pageSize) {

                    pageUl = $('<ul class="pagination pull-right"/>');

                    var pageRange;
                    var pagesToShow;
                    pagesToShow = 5;
                    var prvPages;
                    var postPages;
                    if (pagesToShow % 2 == 0) {
                        prvPages = (pagesToShow / 2) - 1;
                        postPages = (pagesToShow / 2);
                    }
                    else {
                        prvPages = parseInt(pagesToShow / 2);
                        postPages = prvPages;
                    }

                    if ((rowCount / options.pageSize) > 1) {
                        pageRange = Math.ceil(rowCount / options.pageSize)
                    } else {
                        pageRange = parseInt(rowCount / options.pageSize);
                    }

                    var pageNumberShowLower;
                    var pageNumberShowUpper;
                    var showFirstPage = false;
                    var showLastPage = false;

                    if (pageRange > pagesToShow) {
                        if (pageNumber < pagesToShow) {
                            pageNumberShowLower = 1;
                            pageNumberShowUpper = pagesToShow;
                            showLastPage = true;
                        }
                        else {
                            pageNumberShowLower = parseInt(pageNumber) - parseInt(prvPages);
                            pageNumberShowUpper = parseInt(pageNumber) + parseInt(postPages);
                            showFirstPage = true;
                            showLastPage = true;
                        }
                    }
                    else {
                        pageNumberShowLower = 1;
                        pageNumberShowUpper = pageRange;
                    }

                    if (pageNumberShowUpper >= pageRange) {
                        pageNumberShowUpper = pageRange;
                        showLastPage = false;
                    }
                    if (pageNumberShowLower - 1 == 1) {
                        pageNumberShowLower = 1;
                        pageNumberShowUpper = pagesToShow + 1;
                        showFirstPage = false;
                    }
                    if (pageNumberShowUpper + 1 == pageRange) {
                        pageNumberShowUpper = pageRange;
                        showLastPage = false;
                    }

                    var $pageLink;
                    var $pageLi;


                    for (var i = pageNumberShowLower; i <= pageNumberShowUpper; i++) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', i);
                        $pageLink.addClass('page-button');
                        $pageLink.text(i);
                        if (i == pageNumber)
                            $pageLi.addClass('active');

                        $pageLi.append($pageLink);

                        pageUl.append($pageLi);

                        if (i == pageRange)
                            break;
                    }

                    if (showLastPage == true) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a class='dots'/>");
                        $pageLink.text('...');
                        $pageLi.append($pageLink);
                        pageUl.append($pageLi);

                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', pageRange);
                        $pageLink.addClass('page-button')
                        $pageLink.text(pageRange);
                        $pageLi.append($pageLink);
                        pageUl.append($pageLi);
                    }

                    if (showFirstPage == true) {
                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.text('...');
                        $pageLi.prepend($pageLink);
                        pageUl.prepend($pageLi);

                        $pageLi = $('<li/>');
                        $pageLink = $("<a/>");
                        $pageLink.attr('data-p', 1);
                        $pageLink.addClass('page-button');
                        $pageLink.text(1);
                        $pageLi.prepend($pageLink);
                        pageUl.prepend($pageLi);
                    }

                    if (rowCount > 1) {
                        var $previousLi = $('<li/>');
                        var $previousPageLink = $("<a/>").text('Previous').addClass('previous');

                        if (pageNumber == 1) {
                            $previousLi.addClass('disabled');
                        }

                        $previousLi.append($previousPageLink);
                        pageUl.prepend($previousLi);
                    }

                    if (rowCount > 1) {
                        var $nextLi = $('<li/>');
                        var $nextPageLink = $("<a/>").text('Next').addClass('next');

                        if (pageNumber == pageNumberShowUpper) {
                            $nextLi.addClass('disabled');
                        }

                        $nextLi.append($nextPageLink);
                        pageUl.append($nextLi);
                    }

                    if (rowCount == 0) {

                        var $noRecordTr = $('<tr/>');

                        var $noRecordTd = $('<td/>').attr('colspan', $table.find('th').length);
                        $noRecordTd.text(options.NoRecordsFound);
                        $noRecordTr.append($noRecordTd);
                        $table.append($noRecordTr);

                    } else if (rowCount > options.pageSize) {
                        $table.after(pageUl);


                        pageUl.find('a').not('.previous').not('.next').not('.dots').on("click", function () {
                            self.changePage(this, pageSize, null, null);
                        });

                        pageUl.find('a.previous').on("click", function () {
                            self.changePage(this, pageSize, 'previous', pageNumber);
                        });

                        pageUl.find('a.next').on("click", function () {
                            self.changePage(this, pageSize, 'next', pageNumber);
                        });

                    }
                },
                concatJson: function extend(a, b) {
                    for (var key in b)
                        if (b.hasOwnProperty(key))
                            a[key] = b[key];
                    return a;
                },
                changePage: function (thisObj, pageSize, pagerType, pageNumber) {

                    if (pagerType == null) {
                        var sortExpression = options.defaultSortExpression;
                        var sortOrder = options.defaultSortOrder;

                        if ($table.find(options.tableHeading + '[sort-expression=asc]').length > 0) {
                            sortExpression = $table.find(options.tableHeading + '[sort-expression=asc]').attr('field-name');
                            sortOrder = 'asc';
                        }
                        else if ($table.find(options.tableHeading + '[sort-expression=desc]').length > 0) {
                            sortExpression = $table.find(options.tableHeading + '[sort-expression=desc]').attr('field-name');
                            sortOrder = 'desc';
                        }

                        var offset = 0;

                        if ($('.active').length > 0) {
                            offset = ($(thisObj).attr('data-p') - 1) * pageSize;
                            pageNumber = $(thisObj).attr('data-p');
                        }
                        self.createTable(offset, pageSize, sortExpression, sortOrder, pageNumber);
                    } else {

                        if (!$(thisObj).parent('li').hasClass('disabled')) {

                            var pageToTrigger = 1;

                            switch (pagerType) {
                                case 'previous':
                                    pageToTrigger = parseInt(pageNumber) - 1;
                                    break;
                                case 'next':
                                    pageToTrigger = parseInt(pageNumber) + 1;
                                    break;
                            }

                            pageUl.find('a[data-p="' + pageToTrigger + '"]').trigger('click');
                        }
                    }
                }
            };

            self.initialize();

        });

    };
})(jQuery);
