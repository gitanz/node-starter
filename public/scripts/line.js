Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

var chartType = '';
var chartsArray = {};

$.fn.NetworkLoad = function(options){
    var option = {};
    option.left_info = options.yAxis;
    option.left_offset = -80;
    option.chart_type = 'minute_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_NetworkLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: []
    };
    var count = 0;
    $.each(options.color, function(key, value){
        option.chart_data.datasets.push(
            {
                label: options.label[count],
                fillColor: options.color_hover[count],
                strokeColor: value,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: value,
                pointHighlightStroke: options.color_hover[count],
                data: []
            }
        );
        count++;
    });

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value+' kbit/s' %>",
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true
    };

    this.loadChart = function(){
        request_(option, $(this), "NetworkChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.MemoryLoad = function(options){
    var option = {};
    option.left_info = options.yAxis;
    option.left_offset = -60;
    option.data_type = 'int';
    option.chart_type = 'minute_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_memoryLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 8,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value+"MB - "+label+"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true,
        override_max: 1,
        override_step: 5,
        override_steps: 1
    };

    this.loadChart = function(){
        request_(option, $(this), "MemoryChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.ViewLoad = function(options){
    var option = {};
    option.left_info = "";
    option.data_type = 'int';
    option.left_offset = 0;
    option.chart_type = 'max_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_viewLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 1,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value+" - "+label+"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true
    };

    this.loadChart = function(){
        request_(option, $(this), "ViewChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.RequestQueueLoad = function(options){
    var option = {};
    option.left_info = "";
    option.data_type = 'int';
    option.left_offset = 0;
    option.chart_type = 'max_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_requestLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 1,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value+" - "+label+"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true
    };

    this.loadChart = function(){
        request_(option, $(this), "RequestLoadChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.HddLoad = function(options){
    var option = {};
    option.left_info = options.yAxis+" %";
    option.left_offset = -35;
    option.chart_type = 'minute_chart';
    option.user_option = options;
    option.fixedFloat = 3;
    option.top_switcher_button_class = 'top_button_hddLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 4,
        scaleStepWidth : 25,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value +"% - "+ label +"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true
    };

    this.loadChart = function(){
        request_(option, $(this), "HddChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.CpuLoad = function(options){
    var option = {};
    option.left_info = options.yAxis+" %";
    option.left_offset = -48;
    option.chart_type = 'minute_chart';
    option.user_option = options;
    option.fixedFloat = 3;
    option.top_switcher_button_class = 'top_button_cpuLoadAverage';
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 4,
        scaleStepWidth : 25,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value +"% - "+ label +"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true
    };

    this.loadChart = function(){
        request_(option, $(this), "CpuChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.SystemLoadAverage = function(options){
    var option = {};
    option.left_info = "";
    option.left_offset = -56;
    option.chart_type = 'minute_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_systemLoadAverage';
    option.fixedFloat = 2;
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 8,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value +" - "+ label +"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true,
        override_max: 1,
        override_step: 1,
        override_steps : 1,
        scaleShowVerticalLines: false
    };

    this.loadChart = function(){
        request_(option, $(this), "SystemLoadChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

$.fn.HddStorageBars = function(options){
    var option = {};
    option.left_info = "";
    option.left_offset = 0;
    option.chart_type = 'bar_chart';
    option.user_option = options;
    option.top_switcher_button_class = 'top_button_systemLoadAverage';
    option.fixedFloat = 2;
    option.chart_data = {
        labels: [],
        datasets: [
            {
                label: options.label,
                fillColor: options.color_hover,
                strokeColor: options.color,
                pointColor: "rgba(255,255,255,0)",
                pointStrokeColor: "rgba(255,255,255,0)",
                pointHighlightFill: options.color,
                pointHighlightStroke: options.color_hover,
                data: []
            }
        ]
    };

    option.chart_option = {
        animation:false,
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth : 6,
        pointHitDetectionRadius : 0,
        scaleShowVerticalLines: false,
        scaleFontSize: 12,
        scaleOverride: true,
        scaleSteps : 5,
        scaleStepWidth : 1000,
        scaleStartValue : 0,
        scaleLabel: '<%= "    "+value  %>',
        tooltipFontSize: 10,
        tooltipTemplate : '<%= "     "+value +" - "+ label +"     " %>',
        tooltipCaretSize : 7,
        tooltipEvents: ["mousemove"],
        responsive: true,
        override_max: 1,
        override_step: 1,
        override_steps : 1,
    };

    this.loadChart = function(){
        request_(option, $(this), "HddStorageChart");
    }
    this.loadChart();

    return {option: option, object: this};
}

function request_(options, object, chartName){
    chartType = globalChartType.type;
    $.ajax({
        url : options.user_option.url+'/'+globalChartType.type,
        type: "GET",
        beforeSend : function(){

        },
        success : function(){

        },
        failure : function(){

        }
    }).complete(function(data){
        setTimeout(function(){
            request_(options, object, chartName);
        }, 5 * 60 * 1000);

        data = data.responseJSON;
        preChart(data, object, options, chartName);

        $(".all_chart_switcher button").each(function(){
            if($(this).hasClass("active")) {
                $(this).trigger("click");
                return false;
            }
        });
    });
};

function preChart(data, object, options, chartName){
    var serversCount = Object.keys(data).length;
    var servers = getServers(data, options);
    var keys = Object.keys(servers);
    createTopSwitcherButtons(serversCount, servers, object, options);

    var canvas = object.find("canvas");
    var height = canvas.height();
    var width = canvas.width();
    var newCanvas = $('<canvas width="'+width+'" height="'+height+'" />');
    canvas.remove();
    object.html(newCanvas);

    chartCreator(servers[keys[0]], options.chart_data, options.chart_option, options.chart_type, object, chartName);

    object.css({
        position: 'relative'
    });

    //object.closest(".row-fluid").prepend('<div style="position: absolute;width: 100%;height: 100%;"><div class="side_floating_value" style="position: absolute; top: 95%; left: 45%; text-shadow:0px 0px 1px #fff; font-size: 13px; font-weight: normal;">'+options.left_info+'</div></div>');
}

function chartCreator(plot_data, data, option, type, object, chartName){
    data.labels = plot_data[0];
    if(plot_data[1][0] != undefined && plot_data[1][0] instanceof Array){
        for(var i = 0; i < plot_data[1].length; i++){
            var j = 0;
            $.each(data.datasets, function(key, value){
                value.data.push(plot_data[1][i][j]);
                j++;
            });
        }

        if(option.hasOwnProperty("override_max") && option.override_max){
            $.each(data.datasets, function(key, value){
                option.scaleSteps = (parseInt(option.override_step) * parseInt(maxArray(value.data[1]))) + 1;
            });
        }
    }else {
        data.datasets[0].data = plot_data[1];
        if(option.hasOwnProperty("override_max") && option.override_max){
            var x = maxArray(plot_data[1]);

            if(option.hasOwnProperty("override_steps") && option.override_steps) {
                if (x < 100) {
                    option.scaleStepWidth = 10;
                    option.scaleSteps = (Math.ceil(x / 10) + 1);
                }else if (x <= 1000) {
                    option.scaleStepWidth = 100;
                    option.scaleSteps = (Math.ceil(x / 100) + 1);
                } else if (x > 1000) {
                    option.scaleStepWidth = 2000;
                    option.scaleSteps = (Math.ceil(x / 2000) + 1);
                }
            }else{
                option.scaleSteps = (parseFloat(option.override_step) * x )+1;
            }
        }
    }

    switch(type){
        case 'minute_chart':
            minuteChart(data, option, object, chartName);
            break;

        case 'hour_chart':
            hourChart(data, option, object, chartName);
            break;

        case 'max_chart':
            var max = maxArray(plot_data[1]);
            option.scaleStepWidth = max+5;
            maxChart(data, option, object, chartName);
            break;
        case 'bar_chart':
            barChart(data, option, object, chartName);
            break;
        default:
            console.log("Please specify chart type");
            break;
    }
}

//15 min interval
function minuteChart(data, option, object, chartName){
    Chart.types.Line.extend({
        name: "LineAlt",
        initialize: function (data) {
            Chart.types.Line.prototype.initialize.apply(this, arguments);
            var xLabels = this.scale.xLabels;

            xLabels.forEach(function (label, i) {
                label = (label+"").split(".");
                //console.log(globalChartType);
            });
        }
    });

    //object.find("canvas").css({'margin-left':'26px'});
    chartsArray[chartName] = object.find("canvas").get(0).getContext("2d");
    new Chart(chartsArray[chartName]).LineAlt(data, option, object);
    makeLegend(data, object);
    object.scrollLeft(object.find("canvas").width());
}

function hourChart(data, option, object, chartName){
    Chart.types.Line.extend({
        name: "LineAlt",
        initialize: function (data) {
            Chart.types.Line.prototype.initialize.apply(this, arguments);
            var xLabels = this.scale.xLabels;

            xLabels.forEach(function (label, i) {
                var label = Math.abs(parseFloat(label));
                //if (i % 2 == 1)
                //    xLabels[i] = '';
                if(!isInt(label))
                    xLabels[i] = '';
            });

        }
    });

    chartsArray[chartName] = object.find("canvas").get(0).getContext("2d");
    new Chart(chartsArray[chartName]).LineAlt(data, option);
    makeLegend(data, object);
}

function maxChart(data, option, object, chartName){
    Chart.types.Line.extend({
        name: "LineAlt",
        initialize: function (data) {
            Chart.types.Line.prototype.initialize.apply(this, arguments);
            var xLabels = this.scale.xLabels;

           /* xLabels.forEach(function (label, i) {
                label = (label+"").split(".");
                var lab_ = label[1];
                if(lab_ % 15 != 0)
                    xLabels[i] = '';

            });*/

        }
    });

    chartsArray[chartName] = object.find("canvas").get(0).getContext("2d");
    new Chart(chartsArray[chartName]).LineAlt(data, option);
    makeLegend(data, object);
    object.scrollLeft(object.find("canvas").width());
}

function barChart(data, option, object, chartName){
    chartsArray[chartName] = object.find("canvas").get(0).getContext("2d");
    new Chart(chartsArray[chartName]).Bar(data, option);
    makeLegend(data, object);
    object.scrollLeft(object.find("canvas").width());
}

function getServers(data, options){
    var servers = [];
    if(options.chart_data.datasets.length > 1){
        $.each(data, function (key, value) {
            var temp = [], time = [], values = [];

            $.each(value, function(key, value){
                var values_ = [];
                for(var i = 0; i < value.length; i++){
                    if(i == 0){
                        var date_ = new Date(value[0].replace(/-/g, "/"));
                        if(chartType == '7d' || chartType == '30d'){
                            time.push(("0" + date_.getMonth()+1).slice(-2) + "-" + ("0" + date_.getDate()).slice(-2));
                        }else {
                            time.push(("0" + date_.getHours()).slice(-2) + "." + ("0" + date_.getMinutes()).slice(-2));
                        }
                    }else{
                        if (options.hasOwnProperty('data_type') && options.data_type == 'int')
                            var value_ = Math.round(value[i]);
                        else
                            var value_ = parseFloat(value[i]).toFixed(2);

                        values_.push(value_);
                    }
                }
                values.push(values_);
            });

            temp.push(time);
            temp.push(values);

            servers[key] = temp;
        });
    }else {
        $.each(data, function (key, value) {
            var temp = [], value_x = [], value_y = [];

            $.each(value, function (key, value) {
                //var value_ = (value[1] > 4) ? value[1] : (parseFloat(value[1]) / 2);
                if (options.hasOwnProperty('data_type') && options.data_type == 'int')
                    var value_ = Math.round(value[1]);
                else
                    var value_ = parseFloat(value[1]).toFixed(options.fixedFloat);

                var date_ = new Date(value[0].replace(/-/g, "/"));
                if(chartType == '7d' || chartType == '30d'){
                    value_x.push(("0" + date_.getMonth()+1).slice(-2) + "-" + ("0" + date_.getDate()).slice(-2));
                }else {
                    value_x.push(("0" + date_.getHours()).slice(-2) + "." + ("0" + date_.getMinutes()).slice(-2));
                }
                value_y.push(value_);
            });

            temp.push(value_x);
            temp.push(value_y);

            servers[key] = temp;
        });
    }

    return servers;
}

function createTopSwitcherButtons(serversCount, servers, object, options){
    if(! object.find(".btn-group").length) {
        var buttonContainer = $('<div class="btn-group pull-right chart_server_switcher_button" role="group" style="display: none;" />');
        var keys = Object.keys(servers);
        for (var i = 0; i < serversCount; i++) {
            var button = $('<button type="button"  class="btn btn-success ' + (options.top_switcher_button_class) + ' ' + (i == 0 ? 'active' : '' ) + ' " var="' + keys[i] + '" />')
            button.html(keys[i]);
            buttonContainer.append(button);
        }

        object.prepend(buttonContainer);

        $("body").find("."+options.top_switcher_button_class).unbind("click");
        $("body").on("click", "."+options.top_switcher_button_class, function(e){

            e.preventDefault();
            object.parent("div").prev().find("."+options.top_switcher_button_class).removeClass("active");
            $(this).addClass("active");

            var key = $(this).attr("var");
            var canvas = object.find("canvas");
            var height = canvas.height();
            var width = canvas.width();
            var newCanvas = $('<canvas width="'+width+'" height="'+height+'" />');
            canvas.remove();
            object.append(newCanvas);
            if(options.chart_data.datasets.length > 1){
                $.each(options.chart_data.datasets, function(key, value){
                    value.data = [];
                });
            }
            chartCreator(servers[key], options.chart_data, options.chart_option, options.chart_type, object);
        });
    }else{
        object.find(".btn-group .btn-success").removeClass("active");
        object.find(".btn-group .btn-success:first").addClass("active");
    }
}

function isInt(n) {
    return n % 1 === 0;
}

function jsonConcat (o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }

    return o1;
}

function maxArray(array){
    var max = 0;
    $.each(array, function(key, value){
        max = (parseFloat(value) > max)? value : max;
    });

    return max;
}

function makeLegend(data, object) {
    object.find(".btn-link").remove();
    $.each(data.datasets, function (key, value) {
        object.find(".btn-group").prepend('<button class="btn btn-link" style="color: black; cursor: default; font-weight: normal; text-decoration: none;"><span style="display: inline-block; width: 10px; height: 10px; background: ' + value.strokeColor + '"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + value.label + '</button>');
    });
    $btngrp = object.find(".btn-group");
    $btnGrpClone = $btngrp.clone();
    $btnGrpClone.insertBefore(object.parent());
    $btngrp.remove();

}