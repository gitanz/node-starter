if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

$.fn.inputMask = function (options) {
    var MSISDNContainer;
    var referenceArray = [];

    this.AddMSISDN = function (Number) {

        if (referenceArray.indexOf(Number) == -1) {
            var singleMsisdn = $("<div class='singleMsisdn' id='" + Number + "' />");
            referenceArray.push(Number);
            var input = $("<input type='hidden' name='multipleMSISDN[]' value='" + Number + "' />");
            var text = $("<div />");
            text.append(Number);
            text.append("<span class='close glyphicon glyphicon-remove' style='font-size: 10px; line-height: 20px;' />");
            text.css({
                padding: "7px",
                "border-bottom": "1px solid #c9c9c9",
                "box-sizing": "border-box"
            });

            singleMsisdn.append(input);
            singleMsisdn.append(text);

            singleMsisdn.find(".glyphicon").on("click", function (e) {
                $(this).parents('.singleMsisdn').remove();
                referenceArray.splice(referenceArray.indexOf($(this).parents(".singleMsisdn").attr("id")), 1);
            });

            MSISDNContainer.prepend(singleMsisdn);
        }
    };

    this.RemoveAll = function () {
        MSISDNContainer.html("");
        referenceArray = [];
    };

    var Object = $(this);
    Object.focus();
    if (typeof options === 'undefined') {
        console.log("Provide options");
    } else {
        if (options.hasOwnProperty("multiple") && options.multiple == true) {

            var parent = Object.parent();

            Object.parent().css({
                position: "relative"
            });

            MSISDNContainer = $("<div id='msisdnContainer' />");
            MSISDNContainer.css({
                position: "absolute",
                left: function () {
                    if (Object.prev(".input-group-addon").length) {
                        return Object.prev(".input-group-addon").outerWidth() + "px";
                    } else
                        return 0;
                }(),
                width: function () {
                    return Object.outerWidth() + "px"
                }(),
                height: "auto",
                background: "#fff",
                border: "1px solid #c9c9c9",
                "border-top": "none"
            });

            Object.parent().append(MSISDNContainer);

            $(document).click(function (event) {
                if ($(event.target).closest(parent).length == 0) {
                    if (MSISDNContainer != null)
                        MSISDNContainer.hide();
                }
            });
        }

        var defaultValue = Object.val();
        var mask = options.mask.match(/\d+/)[0];
        var defaultValueSet = options.mask;
        var maskLength = options.mask.length;
        var color = {color: "#7A7A7A"};
        var currentCaretPosition = 0;
        selectUnselect(Object, maskLength);
        Object.attr("autocomplete", "off");

        if (defaultValue.substr(0, mask.length) === mask) {
            defaultValueSet += defaultValue.substr(mask.length, defaultValue.length);
        } else {
            defaultValueSet += defaultValue;
        }

        defaultValueSet = defaultValueSet.substr(0, maskLength + options.numbers);
        Object.val(defaultValueSet);
        Object.css(color);
        var newValue = Object.val();
        var currentPosition = Object.val().match(/[\d-]+/)[0].length;
        if (newValue.length > maskLength) {
            for ($i = 0; $i < (maskLength + options.numbers) - currentPosition; $i++) {
                newValue += '_';
            }
            Object.val(newValue);

            setCaretPosition(Object.attr('id'), currentPosition);
        }

        var inputsArray = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 46, 8, 35, 36, 37, 38, 39, 40];
        var numberArray = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

        Object.on("paste", function (e) {
            e.preventDefault();

            var browser = get_browser_info();
            if (browser.name == "IE" || browser.name == "MSIE") {

                var pastedData = window.clipboardData.getData('text');

            } else {
                var pastedData = e.originalEvent.clipboardData.getData('text');//.match(/\d/g); //join("");

            }

            if (pastedData !== null && pastedData != '' && pastedData.match(/\d/g) !== null && pastedData.match(/\d/g) != '') {

                pastedData = pastedData.match(/\d/g).join("");

            } else {

                pastedData = "";
            }

            var selectStart = $(this)[0].selectionStart;
            var selectEnd = $(this)[0].selectionEnd;
            var text = $(this).val().match(/[\d-]/g).join("").trim();

            if (selectStart == selectEnd && selectStart >= maskLength || selectStart == 0) {
                if (pastedData.startsWith(options.mask.match(/\d/g).join(""))) {
                    pastedData = pastedData.substr(mask.length);
                }
            }

            if (selectStart != selectEnd) {
                var data1 = text.substr(0, selectStart);
                var data2 = text.substr(selectEnd, text.length);

                text = data1 + data2;
                selectStart = data1.length;
                var text = [text.slice(0, selectStart), pastedData, text.slice(selectStart)].join('');
            } else {
                var text = [text.slice(0, selectStart), pastedData, text.slice(selectStart)].join('');
            }

            if (selectStart == 0)
                text = options.mask + text;

            if (text.length > options.numbers + maskLength)
                text = text.substr(0, options.numbers + maskLength);

            Object.val(text);
        });


        Object.on("keydown", function (e) {
            var event = e.which;
            var valueLength = $(this).val().length;
            var CurrentValue = $(this).val();
            currentCaretPosition = $(this)[0].selectionStart;
            selectUnselect(Object, maskLength);
            //limit($(this)[0], maskLength+ options.numbers);

            if (event != 13) {
                if (
                    !(
                        (event == 86 && e.ctrlKey) ||
                        (event == 67 && e.ctrlKey) ||
                        (event == 82 && e.ctrlKey) ||
                        (event == 116 && e.ctrlKey) ||
                        (event == 65 && e.ctrlKey)
                    )
                ) {

                    if (inputsArray.indexOf(event) == -1)
                        e.preventDefault();
                }

            }

            if( ($(this).val().match(/[\d-]+/)[0].length == $(this)[0].selectionStart) && event == 46){
                e.preventDefault();
            }

            if($(this).val().match(/[\d-]+/)[0].length >= (maskLength + options.numbers)){
                if($(this)[0].selectionStart != $(this)[0].selectionEnd){
                    return;
                }

                if($.inArray(event, [35,36,37,39,46,8]) == -1)
                    e.preventDefault();
            }

            if($(this).val().indexOf(options.mask) != 0){
                $(this).val(options.mask);
            }

            if(event == 8 && currentCaretPosition == maskLength ){
                e.preventDefault();
            }

            if(event == 8 && $(this).val().match(/[\d-]+/)[0].length == maskLength){
                e.preventDefault();
            }

            if($(this).val().match(/[\d-]+/)[0].length < (maskLength + options.numbers)){
                $(this).val(function(value){
                    var noSpaces = value.match(/[\d-]+/)[0];
                    var length = noSpaces.length;

                    for(var i = 0; i < ((maskLength + options.numbers - 1) - length) ; i++ ){
                        noSpaces += "_";
                    }

                    return noSpaces;
                }($(this).val()));

                setCaretPosition($(this).attr("id"), currentCaretPosition);

            }
        });

        Object.on("keyup", function (e) {
            var event = e.which;
            var CurrentValue = $(this).val();
            var currentPosition = CurrentValue.length;
            var totalLength = CurrentValue.match(/[\d-]+/)[0].length;
            //limit($(this)[0], maskLength+ options.numbers);
            var caretPosition = doGetCaretPosition($(this)[0]);

            if(caretPosition < maskLength){
                setCaretPosition($(this).attr("id"), maskLength);
            }
        });

        Object.on("focus", function () {
            var currentCaretPosition__ = $(this)[0].selectionStart;
            if (MSISDNContainer != null)
                MSISDNContainer.show();

            color.color = "#333333";
            $(this).css(color);

            if(currentCaretPosition__ < maskLength){
                setCaretPosition($(this).attr('id'), maskLength);
            }

            var CurrentValue = $(this).val();
            var newValue = CurrentValue;
            var currentPosition = $(this).val().match(/[\d-]+/)[0].length;
        });

        Object.on("click", function () {
            var currentPosition = $(this).val().match(/[\d-]+/)[0].length;
            if ($(this)[0].selectionStart > currentPosition || $(this)[0].selectionStart < maskLength)
                setCaretPosition($(this).attr('id'), currentPosition);
        });

        Object.on("blur", function () {

            var valueLength = $(this).val().length;

            if (valueLength > maskLength) {
                color.color = "#333";
            } else {
                color.color = "#7A7A7A";
            }

            $(this).css(color);
            var CurrentValue = $(this).val();
            Object.val(CurrentValue.match(/[\d-]+/)[0]);
        });
    }

    function setCaretPosition(elemId, caretPos) {
        var el = document.getElementById(elemId);

        el.value = el.value;
        // ^ this is used to not only get "focus", but
        // to make sure we don't have it everything -selected-
        // (it causes an issue in chrome, and having it doesn't hurt any other browser)

        if (el !== null) {

            if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;
            }

            else {
                // (el.selectionStart === 0 added for Firefox bug)
                if (el.selectionStart || el.selectionStart === 0) {
                    el.focus();
                    el.setSelectionRange(caretPos, caretPos);
                    return true;
                }

                else { // fail city, fortunately this never happens (as far as I've tested) :)
                    el.focus();
                    return false;
                }
            }
        }
    }

    function selectUnselect(Object, maskLength) {
        if (Object.val().length <= maskLength) {
            Object.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        } else {
            Object.removeAttr("unselectable");
            Object.css("user-select", "")
        }
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function limit(element, max_chars) {
        if(element.value.length >= max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    }

    function doGetCaretPosition (oField) {

        // Initialize
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {

            // Set focus on the element
            oField.focus();

            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange();

            // Move selection start to 0 position
            oSel.moveStart('character', -oField.value.length);

            // The caret position is selection length
            iCaretPos = oSel.text.length;
        }

        // Firefox support
        else if (oField.selectionStart || oField.selectionStart == '0')
            iCaretPos = oField.selectionStart;

        // Return results
        return iCaretPos;
    }

    return this;
};

function get_browser_info(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0],
        version: M[1]
    };
}