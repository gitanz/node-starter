(function ($) {

    $.fn.DunotChart = function () {


        return this.each(function () {

            var $piechart = $(this);

            $circleAreaDiffValue = 10;
            $globalWrapperDecrementValue = 10;
            $globalClass = "DunotChart";
            var preStartXDegree = 0;
            var preStartYDegree = 0;
            var interValID = null;

            var donut = {
                donutInit: function () {

                    $piechart.on('change', function () {
                        donut.animateDonut();
                    });

                    donut.iteration(-1);
                    donut.addWrapper();
                },
                addWrapper: function () {

                    $.each($piechart, function (key, value) {

                            $('#' + value['id']).wrap("<div class='dunotWrapper'></div>");

                            $('#' + value['id']).css({
                                'text-align': 'center'
                            });

                            $('#' + value['id']).parent('.dunotWrapper').css({
                                'width': ((parseInt(value.width) ) + 100) + 'px',
                                'min-height': ((parseInt(value.height)) + 50) + 'px',
                                'float': 'left',
                                'margin': '5px'
                            });

                        }
                    )
                    ;


                },
                createDonutPie: function (value) {

                    var cx = value.getAttribute('height') / 2;
                    var cy = value.getAttribute('width') / 2;
                    var wrapr = cy - $globalWrapperDecrementValue;
                    var innerr = wrapr - $circleAreaDiffValue;

                    var width = value.getAttribute('width');
                    var height = value.getAttribute('height');

                    $dunotSVG = '<svg shape-rendering="auto" width="' + width + '" height="' + height + '" viewBox="0 0 ' + height + ' ' + width + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<circle cx="' + cx + '" cy="' + cy + '" r="' + wrapr + '" fill="' + value.getAttribute('outer-circle') + '"' + 'stroke="#D9D9D9" stroke-width="3"' + '></circle>' +
                    '<circle cx="' + cx + '" cy="' + cy + '" r="' + innerr + '"fill="' + value.getAttribute('inner-circle') + '" stroke="#EBEBEB" stroke-width="2"' + '></circle>' +
                    '<g data-order="1"  data-value="100"><path shape-rendering="optimizeQuality" stroke-width="0" stroke="#fff" fill="' + value.getAttribute('process-color') + '" class="pieSegment"></path></g>' +
                    '</svg>';

                    $('#' + value.getAttribute('id')).find('.dunot-chart-container').append($dunotSVG);


                },
                polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
                    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

                    return {
                        x: centerX + (radius * Math.cos(angleInRadians)),
                        y: centerY + (radius * Math.sin(angleInRadians))
                    };
                },
                describeArc: function (x, y, radius, startAngle, endAngle) {

                    var start = donut.polarToCartesian(x, y, radius, endAngle);
                    var end = donut.polarToCartesian(x, y, radius, startAngle);

                    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

                    var d = [
                        "M", start.x, start.y,
                        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
                    ].join(" ");

                    return d;
                },
                processPie: function (plotConfig) {

                    var svgDproperty = (donut.describeArc(plotConfig.radius, plotConfig.radius, plotConfig.radius - ($circleAreaDiffValue + $globalWrapperDecrementValue), plotConfig.startAngle, plotConfig.endAngle) + " L" + plotConfig.radius + ' ' + plotConfig.radius);

                    $('#' + plotConfig.dunotID).find('path').attr('d', svgDproperty);
                    $('#' + plotConfig.dunotID).find('g path').attr('fill', plotConfig.fillColor);


                },
                iteration: function (interval) {

                    var radius = 0;
                    var datapercent = 0;
                    var endAnglePercent = 0;
                    var endAngleDegree = 0;
                    $.each($piechart, function (key, value) {

                        datapercent = Math.round((value.getAttribute('data-value') / value.getAttribute('data-total')) * 100);
                        //     datapercent = value.getAttribute('data-used-percent');

                        var endAnglePercentage = 100;

                        if (interval == -1) {
                            donut.createDonutPie(value);
                            endAnglePercentage = datapercent;

                        } else {
                            endAnglePercentage = interval;
                        }

                        endAngleDegree = Math.round(3.6 * endAnglePercentage);

                        if (value.getAttribute('data-animate') == "false") {

                            endAngleDegree = Math.round(3.6 * datapercent);

                        } else if (value.getAttribute('data-animate') == "true" && interval == -1) {
                            endAngleDegree = 0;
                        }

                        if (datapercent <= endAnglePercentage && value.getAttribute('data-animate') == "true" && interval != -1) {
                            endAngleDegree = Math.round(3.6 * datapercent) - 0.1;
                        }

                        radius = (value.getAttribute('width') / 2);
                        var plotConfig = {
                            radius: radius,
                            startAngle: 0,
                            endAngle: endAngleDegree,
                            dunotID: value.getAttribute('id'),
                            fillColor: value.getAttribute('process-color')
                        };

                        donut.processPie(plotConfig);


                    });


                },
                animateDonut: function () {
                    var usedSpace = $piechart.attr('data-used-percent');

                    var intervalto = 0;
                    var interval = 0;

                    if (interValID != null) {
                        clearInterval(interValID);
                    }

                    interValID = setInterval(function () {
                        intervalto++;

                        if (intervalto - usedSpace <= 0) {
                            $piechart.find('div.used-space-section span.span-info').html(intervalto + ' % ');
                        }
                        interval = intervalto;
                        donut.iteration(interval);
                        intervalto == usedSpace ? clearInterval(interValID) : '';
                    }, 20);
                }

            };

            donut.donutInit();

        });

    };

}
(jQuery)
)
;





