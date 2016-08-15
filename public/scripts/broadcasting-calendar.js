(function ($) {
    $.fn.broadcastingCalendar = function (options) {

        return this.each(function () {
            var $container = null;

            var $triggerControl = null;

            var broadCastingDetails = $('<tr class="broadcasting-details" style="display: none"><td colspan="7"></td></tr>');

            var $control = $(this);

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var russianMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            var russianWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            var daySelector = 'td:not(:empty)';
            var $message = "Broadcasting date:";
            if (options && options.Message != "") {
                $message = options.Message;

            }

            var TeaserID = "Teaser ID";

            if (options && options.TeaserID != "") {
                TeaserID = options.TeaserID;
            }

            var self = {
                initialize: function () {

                    $container = self.initializeContainer().append(self.buildCalender(new Date()))
                        .delegate('.previous-link', 'click', self.loadPrevious)
                        .delegate('.todaySelect', 'click', self.loadToday)
                        .delegate('td.drop-event', 'mouseenter', self.showDropper)
                        .delegate('td.drop-event', 'mouseleave', self.hideDropper)
                        .delegate('.event-placeholder .teaser-icon', 'mouseenter', self.showHoverId)
                        .delegate('.event-placeholder .teaser-icon', 'mouseleave', self.hideHoverId)
                        .delegate('td.drop-event', 'click', self.showHideDetails)
                        .delegate('.event-placeholder .teaser-icon', 'mouseenter', self.highlightSameTeaser)
                        .delegate('.event-placeholder .teaser-icon', 'mouseleave', self.removeHighlightSameTeaser)
                        .delegate('.next-link', 'click', self.loadNext)
                        .delegate('.monthSelect', 'change', self.pickDate)
                        .delegate('.yearSelect', 'change', self.pickDate)
                        .delegate('.prev', 'mouseenter mouseleave', self.addPrevHoverClass)
                        .delegate('.next', 'mouseenter mouseleave', self.addNextHoverClass);

                    $control.html($container);
                }, showHoverId: function () {

                    var isLegend = $(this).closest(".legend-section").length > 0;
                    if (!isLegend) {
                        var hoverTeaserId = $('<i class="teaser-id-hover"></i>');
                        var arrowDown = $('<i class="glyphicon glyphicon-arrow-down"></i>');

                        hoverTeaserId.css({
                            'top': -32, 'left': -41
                        });

                        hoverTeaserId.text(TeaserID+" " + $(this).attr('id'));
                        $(this).append(hoverTeaserId);
                        $(this).append(arrowDown);
                    }
                }, hideHoverId: function () {
                    $(this).html('');
                },
                highlightSameTeaser: function () {
                    var teaserType = $(this).attr('type');
                    var teaserId = $(this).attr('id');

                    var teaserClass = self.getTeaserClass(teaserType);

                    $container.find('table td').removeClass('default-teaser-icon-light');
                    $container.find('table td').removeClass('termless-teaser-icon-light');
                    $container.find('table td').removeClass('priority-teaser-icon-light');
                    $container.find('table td').removeClass('other-teaser-icon-light');

                    $container.find('table td .teaser-icon[id="' + teaserId + '"]').closest('td').addClass(teaserClass + "-light");
                }, removeHighlightSameTeaser: function () {
                    $container.find('table td').removeClass('default-teaser-icon-light');
                    $container.find('table td').removeClass('termless-teaser-icon-light');
                    $container.find('table td').removeClass('priority-teaser-icon-light');
                    $container.find('table td').removeClass('other-teaser-icon-light');
                },
                showDropper: function () {
                    $container.find('table td:not(td.selected) > div.date-event-wrapper').find('#cal-day-tick').remove();

                    var downArrow = $('<div id="cal-day-tick""><i class="icon-chevron-down glyphicon glyphicon-chevron-down"></i></div>');

                    $(this).children(".date-event-wrapper").append(downArrow);

                },
                hideDropper: function () {
                    $container.find('table td:not(td.selected) > div.date-event-wrapper').find('#cal-day-tick').remove();
                },

                showHideDetails: function () {

                    var date = $(this).attr('date');

                    $container.find('table td').removeClass('selected');

                    $(this).addClass('selected');

                    if ($(this).closest('tr').next('tr.broadcasting-details').length == 1 && $(this).closest('tr').next('tr.broadcasting-details').attr('date') == date) {
                        $(this).closest('tr').next('tr.broadcasting-details').remove();
                        $(this).removeClass('selected');
                        $container.find('table td:not(td.selected) > .date-event-wrapper').find('#cal-day-tick').remove();
                        return;
                    }

                    $container.find('table td:not(td.selected) > .date-event-wrapper').find('#cal-day-tick').remove();

                    var downArrow = $('<div id="cal-day-tick""><i class="icon-chevron-down glyphicon glyphicon-chevron-down"></i></div>');

                    $(this).children(".date-event-wrapper").append(downArrow);

                    var selectedDate = new Date(date);

                    var year = parseInt($container.find('.yearSelect').attr('year'));

                    var month = parseInt($container.find('.monthSelect').attr('month'));

                    var currentDate = new Date(year, month - 1, 1);

                    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                    if (moment(date).toDate().getMonth() != currentDate.getMonth()) {
                        if (selectedDate > lastDay) {
                            self.loadNext();
                        } else if (selectedDate < firstDay) {
                            self.loadPrevious();
                        }
                        $triggerControl = $container.find('table tr td[date="' + date + '"]');
                        return;
                    }

                    broadCastingDetails.find('td').html('');

                    broadCastingDetails.insertAfter($(this).closest('tr'));
                    broadCastingDetails.slideDown(2000);
                    $.ajax({
                        url: options.detailsUrl,
                        type: 'GET',
                        data: {date: date},
                        dataType: "html",
                        beforeSend: function () {

                        },
                        complete: function () {

                        },
                        success: function (data) {
                            broadCastingDetails.find('td').html(data);
                            broadCastingDetails.attr('date', date);
                        }
                    });
                },

                hide: function () {
                    $container.fadeOut(200);
                },
                buttonClick: function () {

                    self.hide();
                },
                clicked: function () {

                    $container.find('td a.ui-state-active').removeClass('ui-state-active');
                    $(this).find('a');
                },
                loadPrevious: function () {
                    var year = parseInt($container.find('.yearSelect').attr('year'));
                    var month = parseInt($container.find('.monthSelect').attr('month'));
                    if (month == 1) {
                        year = year - 1;
                        month = 12;
                    } else {
                        month = month - 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.find('.calendar-section').empty().append(self.buildCalender(englishDate));
                    $container.find('td a.ui-state-active').removeClass('ui-state-active');
                },
                loadToday: function () {
                    var currentDate = new Date();

                    var englishDate = new Date((currentDate.getMonth() + 1) + "/1/" + currentDate.getFullYear());

                    $container.find('.calendar-section').empty().append(self.buildCalender(englishDate));
                    $container.find('td a.ui-state-active').removeClass('ui-state-active');
                },
                loadNext: function () {
                    var year = parseInt($container.find('.yearSelect').attr('year'));
                    var month = parseInt($container.find('.monthSelect').attr('month'));
                    if (month == 12) {
                        year = year + 1;
                        month = 1;
                    } else {
                        month = month + 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.find('.calendar-section').empty().append(self.buildCalender(englishDate));
                },
                addPrevHoverClass: function () {
                    $(this).toggleClass('ui-state-hover ui-datepicker-prev-hover');
                },
                addNextHoverClass: function () {
                    $(this).toggleClass('ui-state-hover ui-datepicker-next-hover');
                },
                hover: function () {
                    $(this).toggleClass('ui-state-hover');
                },
                initializeContainer: function () {

                    if ($('.dpp').length == 0) {
                        $('<div class="dpp"/>').insertAfter($('body'));
                    }

                    var eventPicker = $('<div>').addClass('event-calendar-container');

                    $('.dpp').html(eventPicker);

                    return eventPicker;
                },


                _daylightSavingAdjust: function (date) {
                    if (!date) {
                        return null;
                    }
                    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
                    return date;
                },

                _getFirstDayOfMonth: function (year, month) {
                    return new Date(year, month, 1).getDay();
                },

                buildLegend: function () {
                    var legendSection = $('<div class="legend-section"/>');

                    legendSection.append("<h5>" + options.GuideNotation + "</h5>");

                    var ul = $('<ul/>');

                    ul.append($('<li><span class="teaser-icon default-teaser-icon"></span>' + options.DefaultTeaser + '</li>'));
                    ul.append($('<li><span class="teaser-icon termless-teaser-icon"></span>' + options.TermlessTeaser + '</li>'));
                    ul.append($('<li><span class="teaser-icon priority-teaser-icon"></span>' + options.PriorityTeaser + '</li>'));
                    ul.append($('<li><span class="teaser-icon other-teaser-icon"></span>' + options.OtherTeaser + '</li>'));

                    return legendSection.append(ul);

                },

                buildCalender: function (currentDate) {

                    self.buildLegend();

                    var calendarSection = $('<div class="calendar-section"/>');

                    calendarSection.append(self.buildLegend);

                    var inst = {};

                    var todayDate = new Date();

                    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                    var totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                    var calendarHeader = $('<div class="calendar-header"></div>');

                    var previousLink = $('<a class="previous-link"></a>');
                    var previousSpan = $('<span title="Previous Month" class="glyphicon glyphicon-arrow-left"></span>');
                    previousLink.append(previousSpan);

                    var nextLink = $('<a class="next-link"></a>');
                    var nextSpan = $('<span title="Next Month" class="glyphicon glyphicon-arrow-right"></span>');
                    nextLink.append(nextSpan);

                    var monthContainer = $('<div class="month-container"/>');

                    var todaySelect = $('<span class="todaySelect"></span>');
                    var monthSelect = $('<span class="monthSelect"></span>');

                    todaySelect.text(options.Today);

                    switch (options.language) {
                        case "English":
                            monthSelect.text(months[currentDate.getMonth()]);
                            break;
                        default :
                            monthSelect.text(russianMonths[currentDate.getMonth()]);
                            break;
                    }

                    monthSelect.attr('month', currentDate.getMonth() + 1);

                    var yearSelect = $('<span class="yearSelect"></span>');

                    yearSelect.text(currentDate.getFullYear());

                    yearSelect.attr('year', currentDate.getFullYear());

                    monthContainer.append(previousLink);
                    monthContainer.append(monthSelect);
                    monthContainer.append(nextLink);

                    calendarHeader.append(todaySelect);
                    calendarHeader.append(monthContainer);
                    calendarHeader.append(yearSelect);

                    var weeks = Math.ceil((totalDays + firstDay.getDay()) / 7);

                    var $table = $("<table class='calendar-table'/>");
                    var count;

                    var $thead = $('<thead/>');

                    var $trHead = $('<tr/>');
                    $thead.append($trHead);

                    $table.append($thead);

                    for (var k = 0; k < 7; k++) {
                        var $th = $('<th/>');

                        switch (options.language) {
                            case "English":
                                $th.text(weekDays[k]);
                                break;
                            default :
                                $th.text(russianWeekDays[k]);
                                break;
                        }


                        $trHead.append($th);
                    }

                    var drawYear = currentDate.getFullYear();
                    var drawMonth = currentDate.getMonth();
                    var startingDay = 1;

                    var daysInMonth = totalDays;
                    if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                        inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                    }
                    var leadDays = (self._getFirstDayOfMonth(drawYear, drawMonth) - startingDay + 7) % 7;
                    var numRows = Math.ceil((leadDays + daysInMonth) / 7);


                    var $tbody = $('<tbody/>');

                    var printDate = self._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                    for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        var $tr = $('<tr/>');
                        $tbody.append($tr);

                        for (var dow = 0; dow < 7; dow++) { // create date picker days
                            var $td = $('<td/>');
                            var $div = $('<div class="date-event-wrapper"/>');
                            if (todayDate.getFullYear() == printDate.getFullYear() && todayDate.getMonth() == printDate.getMonth() && todayDate.getDate() == printDate.getDate()) {
                                $td.addClass('today');
                            }

                            $td.attr('date', printDate.getFullYear() + "-" + ("0" + (printDate.getMonth() + 1)).slice(-2) + "-" + ("0" + printDate.getDate()).slice(-2));

                            var otherMonth = (printDate.getMonth() !== drawMonth);

                            if (printDate.getDate() == 1) {

                                switch (options.language) {
                                    case "English":
                                        $div.html("<a class='date'>" + months[printDate.getMonth()] + " " + printDate.getDate() + "</a>");
                                        break;
                                    default :
                                        $div.html("<a class='date'>" + russianMonths[printDate.getMonth()] + " " + printDate.getDate() + "</a>");
                                        break;
                                }


                            } else {
                                $div.html("<a class='date'>" + printDate.getDate() + "</a>");
                            }

                            printDate.setDate(printDate.getDate() + 1);

                            printDate = this._daylightSavingAdjust(printDate);

                            $div.append("<div class='event-placeholder'/>");
                            $td.append($div);
                            $tr.append($td);

                        }

                    }

                    $table.append($tbody);

                    calendarSection.append(calendarHeader);

                    calendarSection.append($table);

                    var firstDate = calendarSection.find('tbody tr:first-child td:first-child').attr('date');

                    var lastDate = calendarSection.find('tbody tr:last-child td:last-child').attr('date');

                    self.setValue(firstDate, lastDate);

                    return calendarSection;
                }, getTeaserClass: function (teaserType) {

                    var teaserClass = "";

                    switch (teaserType) {
                        case 'Default':
                            teaserClass = 'default-teaser-icon';
                            break;
                        case 'Termless':
                            teaserClass = 'termless-teaser-icon';
                            break;
                        case 'Priority':
                            teaserClass = 'priority-teaser-icon';
                            break;
                        case 'Other':
                            teaserClass = 'other-teaser-icon';
                            break;
                        default :
                            teaserClass = "";
                            break;
                    }

                    return teaserClass;
                },
                setValue: function (from, to) {
                    $.ajax({
                        url: options.url,
                        type: 'GET',
                        dataType: "json",
                        data: {from: from, to: to},
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                        },
                        complete: function () {

                        },
                        success: function (data) {
                            $.each(data, function (dataIndex, item) {

                                var targetTd = $container.find('table tr td[date="' + item.Date + '"]');

                                if (targetTd.length > 0) {

                                    if (item.message_id != null && item.TeaserType != null ) {
                                        var eventPlaceHolder = targetTd.find('.event-placeholder');

                                        if (!targetTd.hasClass('drop-event')) {
                                            targetTd.addClass('drop-event');
                                        }

                                        var teaserIconSpan = $('<span class="teaser-icon"/>');

                                        teaserIconSpan.attr('id', item.message_id);
                                        teaserIconSpan.attr('title-data', item.message_id);

                                        var teaserClass = self.getTeaserClass(item.TeaserType);

                                        teaserIconSpan.attr('type', item.TeaserType);

                                        teaserIconSpan.addClass(teaserClass);

                                        eventPlaceHolder.append(teaserIconSpan);
                                    }
                                }
                            });

                            if ($triggerControl != null) {
                                $triggerControl.trigger('click');
                                $triggerControl = null;
                            }
                        }
                    });
                }
            };

            var timerWasClicked = false;

            self.initialize();

        });
    };
})(jQuery);