(function ($) {
    $.fn.sliderTimePicker = function (option) {

        return this.each(function () {
            var $input = $(this);
            var $container = null;

            var selectedDateList = [];

            var initStartValue = 480;
            var initEndValue = 1260;

            var self = {
                initialize: function () {
                    $input.click(function (event) {
                        self.initialize();
                        self.show();
                        return false;
                    });
                    $input.focus(function (event) {
                        self.initialize();
                        self.show();
                        return false;
                    });

                    $input.keydown(function (e) {
                        if (e.keyCode == 8 || e.keyCode == 46) {
                            $input.val("");
                            self.initInputValue();
                        } else {
                            e.preventDefault();
                        }
                    });

                    $container = self.initializeContainer().hide()
                        .append(self.buildTimeSlider())
                        .delegate('.ui-button-ok', 'click', self.buttonClick);
                },

                hide: function () {
                    $container.fadeOut(200);
                },

                show: function () {
                    if ($input.val() != "") {
                        $container.empty().append(self.buildTimeSlider());
                    }
                    self.initInputValue();

                    var bottom = $(window).height() - $($input).offset().top - $($input).outerHeight() - 6;

                    var topPosition;

                    if ($container.height() > bottom) {
                        topPosition = $($input).offset().top - $container.height() + 155;
                    } else {
                        topPosition = $($input).offset().top + $($input).outerHeight();
                    }
                    $container.css({
                        'position': 'absolute',
                        'top': topPosition,
                        'left': $($input).offset().left,
                        'z-index': 10000
                    });

                    $container.fadeIn(200);
                },
                initInputValue: function () {
                    if ($input.val() != "") {
                        var inputData = $input.val().split(" ");
                        if (inputData.length <= 1) {
                            $input.val("");
                            return;
                        }

                        var startVal = self.convertHourMinuteToMinute(inputData[0]);
                        var endVal = self.convertHourMinuteToMinute(inputData[2]);

                        $container.find(".timeSlider").slider("values", 0, startVal).slider("values", 1, endVal).slider("option", "step", 10);
                        $container.find(".slider-tpicker-start-time").text(inputData[0]);
                        $container.find(".slider-tpicker-end-time").text(inputData[2]);
                    }
                    else {
                        $container.find(".timeSlider").slider("values", 0, initStartValue).slider("values", 1, initEndValue).slider("option", "step", 10);
                        $container.find(".slider-tpicker-start-time").text(self.convertMinuteToHourMinute(initStartValue));
                        $container.find(".slider-tpicker-end-time").text(self.convertMinuteToHourMinute(initEndValue));
                    }
                },
                setInputValue: function () {
                    var timeFrame = $container.find(".slider-tpicker-start-time").text() + " to " + $container.find(".slider-tpicker-end-time").text();
                    $input.val(timeFrame);

                    $input.trigger('change');
                },
                buttonClick: function () {
                    self.setInputValue();
                    self.hide();
                },
                initializeContainer: function () {

                    if ($('.slider-time-picker-container').length == 0) {
                        $('<div class="slider-time-picker-container"/>').insertAfter($('body'));
                    }

                    var sliderTimePicker = $('<div>').addClass('ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all');

                    $('.slider-time-picker-container').html(sliderTimePicker);

                    return sliderTimePicker;
                },
                convertMinuteToHourMinute: function (time) {
                    var minute = Math.floor(time / 60);
                    var hour = time % 60;
                    minute = minute > 9 ? minute : "0" + minute;
                    hour = hour > 9 ? hour : "0" + hour;
                    return minute + ":" + hour;
                },
                convertHourMinuteToMinute: function (time) {
                    time = time.split(":");
                    return (parseInt(time[0]) * 60) + parseInt(time[1]);
                },
                buildTimeSlider: function () {

                    var pickerHeader = $('<div></div>').addClass('ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all ');

                    var headerTitle = $('<div>Choose Time</div>').addClass('ui-datepicker-title');

                    pickerHeader = pickerHeader.append().append(headerTitle);

                    var $timeDiv = $('<div/>');
                    $timeDiv.addClass('slider-time-picker-div');

                    var $startEndDt = $('<dt/>');

                    $startEndDt.html("<span>Start</span><span style='float: right'>End</span>")

                    var $startTimeDD = $('<span class="slider-tpicker-start-time slider-value"/>');
                    var $endTimeDD = $('<span class="slider-tpicker-end-time slider-value"/>');

                    var $hourSliderDiv = $('<div class="timeSlider"/>');


                    $hourSliderDiv.slider({
                        range: true,
                        values: [initStartValue, initEndValue],
                        min: 0,
                        max: 1440,
                        step: 1,
                        create: function (event, ui) {
                            var startTime = self.convertMinuteToHourMinute(initStartValue);
                            var endTime = self.convertMinuteToHourMinute(initEndValue);
                            $startTimeDD.text(startTime);
                            $endTimeDD.text(endTime);
                        },
                        slide: function (event, ui) {
                            var startTime = self.convertMinuteToHourMinute(ui.values[0]);
                            var endTime = self.convertMinuteToHourMinute(ui.values[1]);
                            $startTimeDD.text(startTime);
                            $endTimeDD.text(endTime);
                            //self.setInputValue();
                        }
                    });

                    var $sliderHandles = $hourSliderDiv.find("a");
                    $($sliderHandles[0]).append($startTimeDD);
                    $($sliderHandles[1]).append($endTimeDD);

                    $timeDiv.append($startEndDt).append($hourSliderDiv);

                    var $buttonOk = $('<input type="button" value="Ok" class="slider-time-picker-button btn btn-primary"/>');
                    $buttonOk.addClass('ui-button-ok');

                    pickerHeader = pickerHeader.add($timeDiv).add($buttonOk);

                    return pickerHeader;
                }
            };

            self.initialize();

            $(document).mousedown(function (event) {
                if (($(event.target).closest('.ui-datepicker').length == 0) && $(event.target)[0] != $input[0]) {
                    $container.fadeOut(200);
                }
            });

        });
    };
})(jQuery);