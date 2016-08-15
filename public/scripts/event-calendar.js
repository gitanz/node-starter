(function ($) {
    $.fn.eventCalandar = function (options) {

        return this.each(function () {
            var $container = null;

            var $control = $(this);

            var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
            var weeekDays = new Array('Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun');
            var daySelector = 'td:not(:empty)';
            var $message = "Broadcasting date:";
            if(options && options.Message!=""){
                $message = options.Message;
            }



            var self = {
                initialize: function () {

                    $container = self.initializeContainer().append(self.buildCalender(new Date()))
                        .delegate('.date-checker', 'click', self.addEvent)
                        .delegate('.prev', 'click', self.loadPrevious)
                        .delegate('.next', 'click', self.loadNext)
                        .delegate('.monthSelect', 'change', self.pickDate)
                        .delegate('.yearSelect', 'change', self.pickDate)
                        .delegate('.prev', 'mouseenter mouseleave', self.addPrevHoverClass)
                        .delegate('.next', 'mouseenter mouseleave', self.addNextHoverClass);

                    $control.html($container);
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
                    var year = parseInt($(this).closest('.event-calendar-container').find('.yearSelect').val());
                    var month = parseInt($(this).closest('.event-calendar-container').find('.monthSelect').val());
                    if (month == 1) {
                        year = year - 1;
                        month = 12;
                    } else {
                        month = month - 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.empty().append(self.buildCalender(englishDate));
                    $container.find('td a.ui-state-active').removeClass('ui-state-active');
                },
                loadNext: function () {
                    var year = parseInt($(this).closest('.event-calendar-container').find('.yearSelect').val());
                    var month = parseInt($(this).closest('.event-calendar-container').find('.monthSelect').val());
                    if (month == 12) {
                        year = year + 1;
                        month = 1;
                    } else {
                        month = month + 1;
                    }
                    var englishDate = new Date(month + "/1/" + year);

                    $container.empty().append(self.buildCalender(englishDate));
                },
                pickDate: function () {


                    var year = parseInt($(this).closest('.event-calendar-container').find('.yearSelect').val());
                    var month = parseInt($(this).closest('.event-calendar-container').find('.monthSelect').val());
                    var englishDate = new Date(month + "/1/" + year);
                    $container.empty().append(self.buildCalender(englishDate));

                    setDataInEventCalendar();
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
                addEvent: function () {
                    if ($(this).is(':checked')) {

                        var eventDiv = $('<div class="broadcast-event"/>');

                        var header = $('<h3>' + $message + '</h3>');

                        var fromDiv = $('<div/>');

                        var fromLabel = $('<label class="from-label event-label">From:</label>');

                        var fromData = $('<span class="from-data"/>');

                        fromDiv.append(fromLabel);
                        fromDiv.append(fromData);

                        var toDiv = $('<div/>');

                        var toLabel = $('<label class="to-label event-label">To:</label>');

                        var toData = $('<span class="to-data"/>');

                        toDiv.append(toLabel);
                        toDiv.append(toData);

                        var rangeSelector = $('<span class="range-selector glyphicon glyphicon-time"></span>');

                        var rangeSelectorInput = $('<input type="hidden" class="range-selector-input"/>');

                        rangeSelector.click(function () {
                            eventDiv.find(rangeSelectorInput).trigger('click');
                        });

                        rangeSelectorInput.change(function () {

                            var rangeArray = rangeSelectorInput.val().split(' to ');

                            fromData.text(rangeArray[0]);

                            toData.text(rangeArray[1]);

                            $(this).closest('td').attr('start-time', rangeArray[0]);

                            $(this).closest('td').attr('end-time', rangeArray[1]);
                        });



                        eventDiv.append(header);
                        if (options && options.rangeSelector == true) {

                            eventDiv.append(fromDiv);
                            eventDiv.append(toDiv);
                            eventDiv.append(rangeSelector);

                        }

                        rangeSelectorInput.val('00:00:00 to 23:59:59');

                        eventDiv.append(rangeSelectorInput);

                        $(this).closest('td').find('.event-placeholder').html(eventDiv);

                        rangeSelectorInput.trigger('change');

                        $(this).closest('td').find('.event-placeholder').addClass('selected-event');

                        rangeSelectorInput.sliderTimePicker();
                    } else {
                        $(this).closest('td').find('.event-placeholder').html('');
                        $(this).closest('td').find('.event-placeholder').removeClass('selected-event');
                    }


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

                buildCalender: function (currentDate) {

                    var inst = {};

                    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                    var totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                    var calendarHeader = $('<div class="calendar-header"></div>');

                    var previousLink = $('<span></span>');
                    var previousSpan = $('<span></span>');
                    previousLink.append(previousSpan);

                    var nextLink = $('<a></a>');
                    var nextSpan = $('<span></span>');
                    nextLink.append(nextSpan);

                    var headerTitle = $('<div></div>');

                    var monthSelect = $('<select class="monthSelect"></select>');
                    var yearSelect = $('<select class="yearSelect"></select>');
                    var i;
                    for (i = 0; i < months.length; i++) {
                        if (i == (currentDate.getMonth())) {
                            monthSelect.append("<option value='" + (i + 1) + "' selected='selected'>" + months[i] + "</option>");
                        } else {
                            monthSelect.append("<option value='" + (i + 1) + "'>" + months[i] + "</option>");
                        }
                    }


                    for (i = 2000; i <= 2020; i++) {
                        if (i == (currentDate.getFullYear())) {
                            yearSelect.append("<option value='" + i + "' selected='selected'>" + i + "</option>");
                        } else {
                            yearSelect.append("<option value='" + i + "'>" + i + "</option>");
                        }
                    }

                    headerTitle.append(monthSelect).append(yearSelect);

                    calendarHeader = calendarHeader.append(previousLink).append(nextLink).append().append(headerTitle);


                    var weeks = Math.ceil((totalDays + firstDay.getDay()) / 7);

                    var $table = $("<table/>");
                    var count;

                    var $trHead = $('<tr/>');
                    $table.append($trHead);

                    for (var k = 0; k < 7; k++) {
                        var $th = $('<th/>');
                        $th.text(weeekDays[k]);
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

                    var printDate = self._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                    for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        var $tr = $('<tr/>');
                        $table.append($tr);

                        for (var dow = 0; dow < 7; dow++) { // create date picker days
                            var $td = $('<td/>');

                            $td.attr('date', printDate.getFullYear() + "-" + ("0" + (printDate.getMonth() + 1)).slice(-2) + "-" + ("0" + printDate.getDate()).slice(-2));

                            var otherMonth = (printDate.getMonth() !== drawMonth);

                            if (printDate.getDate() == 1) {
                                $td.html("<a class='date'>" + months[printDate.getMonth()] + " " + printDate.getDate() + "</a>");
                            } else {
                                $td.html("<a class='date'>" + printDate.getDate() + "</a>");
                            }

                            printDate.setDate(printDate.getDate() + 1);

                            printDate = this._daylightSavingAdjust(printDate);

                            $td.append("<input type='checkbox' class='date-checker'/>");

                            var checkBoxHider = $("<div class='checkbox-hider'/>");

                            var timerHinder = $("<div class='timer-hider'/>");

                            $td.append("<div class='event-placeholder'/>");

                            $td.append(checkBoxHider);

                            $td.append(timerHinder);

                            $($td.find('.checkbox-hider')).on('click', function () {
                                $(this).closest('td').find('.date-checker').trigger('click');
                            });


                            $td.find('.event-placeholder').on('click', function (e) {
                                if (!timerWasClicked)
                                    $(this).closest('td').find('.date-checker').trigger('click');

                                timerWasClicked = false;
                            });

                            $td.find('.timer-hider').on('click', function (e) {
                                timerWasClicked = true;
                                $(this).closest('td').find('.range-selector').trigger('click');

                            });

                            $tr.append($td);

                        }

                    }
                    calendarHeader = calendarHeader.add($table);

                    return calendarHeader;
                }
            };

            var timerWasClicked = false;

            self.initialize();

        });
    };
})(jQuery);