$.fn.CSVFileUpload = function (options) {
    options.title = UILanguage.fileImportOptions;
    var object = $(this);
    var Text = null;
    var defaultCheckboxesArray = [];
    var otherText = '';
    var fields = 0;
    var characterEncoding = $.parseJSON(CSVEncoding);
    var firstEncoding = function(){
        var first = '';
        $.each(characterEncoding, function(key, value){
            if(value == 1) {
                first = key;
                return;
            }
        });
        return first;
    }();
    var newPopup = true;
    var selectedEncoding = '';

    var file = $(this).find("input[type='file']")[0].files[0];

    if (typeof file === 'undefined') {
        showMessage(options.popUpDiv, "error", UILanguage.selectFile);
    } else {
        init(firstEncoding);
    }

    function init(encoding){
        selectedEncoding = encoding;
        var fileName = file.name;
        var fileExtension = fileName.split('.').pop().toLowerCase();
        if (fileExtension === 'csv') {

            var reader = new FileReader();

            reader.onload = function () {

                debugger;
                Text = reader.result;

                showPopup(parseData(), newPopup);
                newPopup = false;
            };
            reader.readAsText(file, encoding);
        }else {
            showMessage(options.popUpDiv, "error", UILanguage.selectCSVFile);
        }
    }

    function clearAll(){
        $("body").find("#CSVFileUpload-Popup").html("");
    }

    $("body").on("change", "#encodingChanger", function(){
        var encoding = $(this).val();
        clearAll();
        init(encoding);
    });

    function parseData(checkText){
        checkText = (typeof checkText === 'undefined')? false : checkText;
        var lines = Text.split(/[\r\n]+/g);
        var linesLength = lines.length > 10 ? 10 : lines.length;
        var formats = (checkText == false)? checkFormat(Text) : checkText;
        formats.regex = otherText == '' ? formats.regex : '('+formats.regex+')|('+otherText+')';
        formats.regex = new RegExp(formats.regex);
        defaultCheckboxesArray = formats.separators;
        var Data = [];
        for (var i = 0; i < linesLength; i++) {
            //if(otherText != ''){
            //    lines[i] = (lines[i].replace(new RegExp(otherText, 'g'), ','));
            //}

            var temp_data = lines[i].split(formats.regex);
            temp_data = temp_data.filter(Boolean);

            for (var j = 0; j < temp_data.length; j++)
                if (temp_data[j] == otherText)
                    temp_data[j] = '';

            Data[i] = temp_data;
            var last_char = lines[i].slice(-1);
            if(last_char == ';' || last_char == ','){
                if(Data[i].slice(-1)[0] == ''){
                    Data[i].pop();
                }
            }

            if(i == 0) {
                fields = Data[i].length;
            }
        }

        return Data;
    }

    function defaultCheckboxes(){
        $("body").find("input.checkbox-csvForm").prop("checked", false);
        $.each(defaultCheckboxesArray, function(key, value){
            $("body").find("input.checkbox-csvForm[value='"+value+"']").prop("checked", true);
        });
    }

    function checkFormat(value) {
        var returnFormat = '[';
        var separators = [];
        if (value != null) {
            if (value.indexOf('\t') >= 0) {
                returnFormat += '\\t';
                separators.push('tab');
            }
            if (value.indexOf(',') >= 0) {
                returnFormat += ',';
                separators.push('comma')
            }
            if (value.indexOf(';') >= 0) {
                returnFormat += ';';
                separators.push('semicolon');
            }
            if (value.indexOf(' ') >= 0) {
                returnFormat += '\\s';
                separators.push('space');
            }
            returnFormat +=']';
        }else{
            returnFormat = '[\\t,;]';
            separators = ['tab', 'comma', 'semicolon'];
        }
        //
        //returnFormat = otherText == '' ? returnFormat : '('+returnFormat+')|('+otherText+')';
        return {"regex" : returnFormat, "separators" : separators};

    }

    function checkFormatClickEvent(separators) {
        var returnFormat = '[';
        $.each(separators, function(key, value){
            if(value == 'tab')
                returnFormat += '\\t';
            else if(value == 'comma')
                returnFormat += ',';
            else if(value == 'space')
                returnFormat += ' ';
            else if(value == 'semicolon')
                returnFormat += ';';
        });
        returnFormat += ']';

        return {"regex" : returnFormat, "separators" : separators};

    }


    //select boxes are in the function "topFields"
    //checkboxes events
    $("body").on("click", ".checkbox-csvForm", function () {
        filterData();
    });

    $("body").on("keyup", '#other-text', function(){
        otherText = $(this).val();
        if(otherText == '')
            $("body").find("#other-checkbox").prop("checked", false);
        else
            $("body").find("#other-checkbox").prop("checked", true);
        filterData();
    });

    function filterData(){
        if (Text != null) {
            var separatedBy = $("body").find("#separated-by-fields").serializeArray();
            var separatedByArray = [];
            $.each(separatedBy, function(key, value){
                if(value['name'] == 'ImportSeparationType[]'){
                    separatedByArray.push(value['value']);
                }
            });

            //formatTextSeparation(separatedBy);
            var Data = parseData(checkFormatClickEvent(separatedByArray));
            $("body").find("#csv-form-left-part").append(bottomFields(Data));
        }
    }

    //Okay button click event
    //$("body").on("click", "#csvForm-OkayButton", function () {
    //    //conditions
    //    object.unbind('submit');
    //    object.trigger("submit");
    //});

    function showPopup(Data, popupShow) {

        var popUpForm = $('<form id="CSVFileUpload-Popup-Form"/>');
        popUpForm.append(createLeftOptions(Data));
        popUpForm.append(createRightButtons());

        if(popupShow) {
            var popup = $('<div id="CSVFileUpload-Popup"/>');

            popup.dialog({
                width: 650,
                height: 530,
                modal: true,
                title: options.title,
                position: 10,
                close: function () {
                    removeDialog(this);
                },
                open: function () {
                    var closeBtn = $('.ui-dialog-titlebar-close');
                    closeBtn.html('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>');
                },
                dialogClass: 'dlgfixed'
            });

            popup.html(popUpForm);
        }else{
            $("body").find("#CSVFileUpload-Popup").html(popUpForm);
        }

        defaultCheckboxes();
    }

    function createLeftOptions(Data) {
        var leftOptions = $('<div id="csv-form-left-part" />');
        leftOptions.css({
            width: '75%',
            display: 'inline-block',
            padding: '5px',
            'box-sizing': 'border-box',
            'font-size': '12px',
            'vertical-align': 'top'
        });

        //Very top fields
        leftOptions.append(topFields(Data));

        //Very middle fields
        leftOptions.append(middleFields(Data));

        //Very bottom fields
        leftOptions.append(bottomFields(Data));

        return leftOptions;
    }

    function topFields(Data) {
        var fieldSet = $('<div />');
        fieldSet.append('<hr style="border-color: #ffffff; margin-bottom: -9px; border-bottom: 0;" /><label style="margin-bottom: 5px; display: inline-block; padding-right: 5px;">'+UILanguage.import+'</label>');
        fieldSet.css({
            'border-bottom': 0,
            'border-left': 0,
            'border-right': 0,
            'border-color': '#fff',
            'box-sizing': 'border-box'
        });

        var fieldsContainer = $('<div />');
        var firstField = $('<div />');

        var encodings = '';

        encodings += '<label style="display: inline-block; margin: 0 0 10px 15px; width: 130px; vertical-align: top; padding-top: 3px;">'+UILanguage.characterSet+'</label>' +
        '<select style="width: 268px;" class="dropdown" id="encodingChanger">';

        $.each(characterEncoding, function(key, value){
            if(value == 1){
                encodings += '<option value="'+key+'" '+((selectedEncoding == key) ? "selected" : "") +' >'+key+'</option>';
            }
        });

        encodings +='</select>';

        firstField.append(encodings);

        fieldsContainer.append(firstField);
        fieldSet.append(fieldsContainer);

        var fieldsContainer = $('<div />');
        var firstField = $('<div />');
        firstField.append('' +
        '<label style="display: inline-block; margin: 0 0 10px 15px; width: 130px; vertical-align: top; padding-top: 3px;">'+UILanguage.language+'</label>' +
        '<select style="width: 268px;" class="dropdown">' +
        '<option>Default- Russian </option>' +
        '</select>');

        fieldsContainer.append(firstField);
        fieldSet.append(fieldsContainer);

        var fieldsContainer = $('<div />');
        var firstField = $('<div />');
        firstField.append('' +
        '<label style="display: inline-block; margin: 0 0 10px 15px; width: 130px; vertical-align: top; padding-top: 3px;">'+UILanguage.fromRow+'</label>' +
        '<input type="number" id="CSV-row-number" value="0" style="width: 60px;" min="0" name="FromRow"/>');

        fieldsContainer.append(firstField);
        fieldSet.append(fieldsContainer);

        return fieldSet;
    }

    function middleFields(Data) {
        var fieldSet = $('<form action="" method="GET" id="separated-by-fields" />');
        fieldSet.append('<hr style="border-color: #ffffff; margin-bottom: -9px; border-bottom: 0;" /><label style="margin-bottom: 5px; display: inline-block; padding-right: 5px;">'+UILanguage.separatorOptions+'</label>');
        fieldSet.css({
            'border-bottom': 0,
            'border-left': 0,
            'border-right': 0,
            'border-color': '#fff',
            'box-sizing': 'border-box'
        });

        var fieldContainer = $('<div />');
        var radioButton = $('<label style="margin-bottom: 5px; display: block;"><input type="radio" style="margin-left: 15px;" checked />'+UILanguage.separatedBy+'</label>');

        fieldContainer.append(radioButton);

        fieldContainer.append('<div class="row" style="margin-left: 10px">' +
        '<div class="col-xs-3"><label><input type="checkbox" class="checkbox-csvForm" id="tab-checkbox" value="tab" name="ImportSeparationType[]"/> '+UILanguage.tab+'</label></div>' +
        '<div class="col-xs-3"><label><input type="checkbox" class="checkbox-csvForm" id="comma-checkbox" value="comma" name="ImportSeparationType[]" /> '+UILanguage.comma+'</label></div>' +
        '<div class="col-xs-3"><label><input type="checkbox" class="checkbox-csvForm" id="other-checkbox" value="other" name="ImportSeparationType[]" /> '+UILanguage.other+'</label></div>' +
        '<div class="col-xs-3"><input type="text" id="other-text" style="width: 74px;" class="form-control" name="OtherSeparationText" /></div>' +
        '</div>');
        fieldContainer.append('<div class="row" style="margin-left: 10px">' +
        '<div class="'+((UILanguage.UILanguage == "Russian")? 'col-xs-4' : 'col-xs-3') +'"><label><input type="checkbox" class="checkbox-csvForm" id="tab-semicolon" value="semicolon" name="ImportSeparationType[]"/> '+UILanguage.semicolon+'</label></div>' +
        '<div class="col-xs-3"><label><input type="checkbox" class="checkbox-csvForm" id="comma-space" value="space" name="ImportSeparationType[]" /> '+UILanguage.space+'</label></div>' +
        '</div><br><br>');

        fieldSet.append(fieldContainer);

        return fieldSet;
    }

    function bottomFields(Data) {
        if($("body").find("#table-with-csv-data").length){
            $("body").find("#table-with-csv-data").remove();
        }

        var fieldSet = $('<div id="table-with-csv-data" />');
        fieldSet.append('<hr style="border-color: #ffffff; margin-bottom: -9px; border-bottom: 0;" /><label style="margin-bottom: 5px; display: inline-block; padding-right: 5px;">'+UILanguage.fields+'</label>');
        fieldSet.css({
            'border-bottom': 0,
            'border-left': 0,
            'border-right': 0,
            'border-color': '#fff',
            'box-sizing': 'border-box',
            'margin-top': -60
        });

        var tableContainer = $('<div id="preview"/>');
        tableContainer.css({
            background: '#ABABAB',
            overflow: 'scroll',
            'min-height': '150px',
            'max-height': '150px',
            'width': '100%',
            border: '1px solid #ABABAB'
        });
        var table = $('<table cellspacing="0" />');
        table.css({
            border: "0 !important"
        });

        var headers = 0;
        var tr = $('<tr />');
        tr.append('<th style="background: #F0F0F0; border-right: 1px solid #ABABAB; border-bottom: 1px solid #ABABAB;">&nbsp;</th>');
        for(headers = 0; headers < maxLength(Data); headers++){
            tr.append('<th style="background: #F0F0F0; font-weight: normal; border-right: 1px solid #ABABAB; border-bottom: 1px solid #ABABAB; padding-right: 10px;">'+UILanguage.standard+'</th>');
        }
        table.append(tr);

        var count = 0;
        var dataCount = 1;
        $.each(Data, function (key, value){
            dataCount = 1;
            var tr = $('<tr />');
            tr.append('<td style="background: #F0F0F0; border-right: 1px solid #ABABAB; border-bottom: 1px solid #ABABAB; padding: 0 4px;">' + (count + 1) + '</td>');
            $.each(value, function (key, data) {
                tr.append('<td style="background: #FFFFFF;white-space:nowrap; border-right: 1px solid #ABABAB; border-bottom: 1px solid #ABABAB; line-height: 10px;">' + data + '</td>');
                dataCount++;
            });
            for(var $i=0;$i <= headers-dataCount;$i++){
                tr.append('<td style="background: #FFFFFF;white-space:nowrap; border-right: 1px solid #ABABAB; border-bottom: 1px solid #ABABAB; line-height: 10px;">&nbsp;</td>');
            }

            table.append(tr);

            count++;
        });

        tableContainer.append(table);
        fieldSet.append(tableContainer);

        return fieldSet;
    }

    function createRightButtons() {
        var rightButtons = $('<div />');
        rightButtons.css({
            width: '25%',
            display: 'inline-block',
            padding: '5px',
            'box-sizing': 'border-box',
            'font-size': '12px',
            'vertical-align': 'top'
        });

        var okButton = $('<button style="width: 100%; margin-bottom: 10px;" type="button" id="csvForm-OkayButton" class="btn btn-success" />');
        okButton.html(UILanguage.ok);
        okButton.on("click", function () {
            var actualForm = $("body").find("#"+options.form);

            var data = {};

            data['FromRow'] = $("body").find("#CSV-row-number").val();

            data['ImportSeparationType'] = defaultCheckboxesArray;

            data['OtherSeparationText'] = otherText;

            data['fields'] = fields;

            actualForm.find('input[type="hidden"]#' + options.importProperties).val(JSON.stringify(data));

            ///$(this).closest('.ui-dialog-content').dialog('close');
            console.log(actualForm);
            actualForm.submit();
        });

        var cancelButton = $('<button style="width: 100%;" type="button" value="Cancel" class="btn btn-danger" style="margin-left: 10px"/>');
        cancelButton.html(UILanguage.cancel);
        cancelButton.on("click", function () {
            $(this).closest('.ui-dialog-content').dialog('close');
        });

        rightButtons.append(okButton);
        rightButtons.append(cancelButton);

        return rightButtons;
    }

    function showMessage(MessageContainer, Type, Message, TimeOut) {
        TimeOut = (typeof TimeOut === 'undefined') ? 4000 : TimeOut;

        var message = $('<div class="alert" role="alert" />');
        message.html(Message);

        if (Type == 'success') {
            message.addClass("alert-success");
        } else if (Type == 'danger') {
            message.addClass("alert-danger");
        } else if (Type == 'info') {
            message.addClass("alert-info");
        } else if (Type == 'warning') {
            message.addClass("alert-warning");
        }

        $('body').find("#" + MessageContainer).html(message);

        setTimeout(function () {
            message.remove();
        }, TimeOut);
    }

    function maxLength($array){
        var length = 0;
        $.each($array, function(key, value){
            length = value.length > length ? value.length : length;
        });
        return length;
    }
}