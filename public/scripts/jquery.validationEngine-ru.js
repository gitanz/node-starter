(function ($) {
    $.fn.validationEngineLanguage = function () {
    };
    $.validationEngineLanguage = {
        newLang: function () {
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "* Это поле обязательно",
                    "alertTextCheckboxMultiple": "* Вы должны выбрать вариант",
                    "alertTextCheckboxe": "* Необходимо отметить"
                },
                "requiredInFunction": {
                    "func": function (field, rules, i, options) {
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Значением поля должно быть test"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* Ошибка! Вы ввели неверный номер. ",
                    "alertText2": ""
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* Ошибка! Вы ввели неверный номер. ",
                    "alertText2": ""
                },
                "groupRequired": {
                    "regex": "none",
                    "alertText": "* Вы должны заполнить одно из следующих полей"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* Минимальное значение "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* Максимальное значение "
                },

                "past": {
                    "regex": "none",
                    "alertText": "* Дата до "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* Дата от "
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* Нельзя выбрать столько вариантов"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* Пожалуйста, укажите ",
                    "alertText2": "критерий Баланса."
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* Поля не совпадают"
                },
                "lessThan": {
                    "regex": "none",
                    "alertText": "* Дата окончания вещания<br/>должна быть больше<br/>даты  начала"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* Неверный номер кредитной карты"
                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
                    "alertText": "* Неправильный формат телефона"
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "alertText": "* Неверный формат email"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* Не целое число"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "* Неправильное число с плавающей точкой"
                },
                "number10Decimals2":{
                    "regex": /^-?\d{0,10}(\.\d{0,2})?$/,
                    "alertText": "* Максимальное количество 12 знаков, Формат (0.99)"
                },
                "numberTwoDecimals": {
                    "regex": /^(?=.*\d)\d*(?:\.\d\d)?$/,
                    "alertText": "* Invalid number"
                },
                "number10Decimals2":{
                    "regex": /^-?\d{0,10}(\.\d{0,2})?$/,
                    "alertText": "* Максимальное количество 12 знаков, Формат (0.99)"
                },
                "digits12": {
                    "regex": /\d{1,3}-\d{1,9}/,
                    "alertText": "* Ошибка! Вы ввели неверный номер."
                },
                "password": {
                    "regex": /^(?=.*\d)(?=.*[a-z])(?=.*(_|[^\w]))(?=.*[A-Z]).{9,20}$/,
                    "alertText": "Password should consist of <br/>" +
                    " ● atleast 9 characters<br/>" +
                    " ● atmax 20 characters<br/>" +
                    " ● atleast 1 Lowercase letter<br/>" +
                    " ● atleast 1 Uppercase letter<br/>" +
                    " ● atleast 1 Digit <br/>" +
                    " ● atleast 1 Symbol <br/>"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "* Неправильная дата (должно быть в ДД.MM.ГГГГ формате)"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* Неправильный IP-адрес"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* Неправильный URL"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Только числа"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\u0400-\u04FF\ \']+$/,
                    "alertText": "* Только буквы"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z\u0400-\u04FF]+$/,
                    "alertText": "* Запрещены специальные символы"
                },
                // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    "alertText": "* Этот пользователь уже занят",
                    "alertTextLoad": "* Проверка, подождите..."
                },
                "ajaxNameCall": {
                    // remote json service location
                    "url": "ajaxValidateFieldName",
                    // error
                    "alertText": "* Это имя уже занято",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* Это имя доступно",
                    // speaks by itself
                    "alertTextLoad": "* Проверка, подождите..."
                },
                "validate2fields": {
                    "alertText": "* Пожалуйста, введите HELLO"
                },
                //tls warning:homegrown not fielded
                "dateFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "* Неверная дата"
                },
                //tls warning:homegrown not fielded
                "dateTimeFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "* Invalid Date or Date Format",
                    "alertText2": "Expected Format: ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM or ",
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
                },
                "multiplemsisdn": {
                    // HTML5 compatible email regex ( http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#    e-mail-state-%28type=email%29 )
                    "regex": /^(\d*,\s)*\d*$/,
                    "alertText": "* Неверный формат (требуются {msisdn}, {msisdn}, ..)"
                },
                "StopDate": {
                    "func": function () {
                        start = $("#start").val();
                        stop = $("#stop").val();
                        return stop > start;
                    },
                    "alertText": "* Время запуска не должно превышать время окончания"
                },
                "ajaxActiveServiceIDCallPhp": {
                    "url": BASE_URL + "AllocationCriteria/ActiveServiceIDCheck",
                    // you may want to pass extra data on the ajax call
                    "extraDataDynamic": [{'ParameterName': 'EditID', 'ParameterValue': "#EditID"}],
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertText": "* This Active Service ID is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxCheckUniqueBlacklist": {
                    "url": "Blacklist/checkNumberUniqueness",
                    // you may want to pass extra data on the ajax call
                    "extraDataDynamic": [{'ParameterName': 'value', 'ParameterValue': "#Value"}],
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertText": "* Этот номер уже есть в Черном списке",
                    "alertTextLoad": "* Проверка, пожалуйста подождите"
                },
                "ajaxCheckUniqueWhitelist": {
                    "url": "Whitelist/checkNumberUniqueness",
                    // you may want to pass extra data on the ajax call
                    "extraDataDynamic": [{'ParameterName': 'value', 'ParameterValue': "#Value"}],
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertText": "* Этот номер уже есть в Белом списке",
                    "alertTextLoad": "* Проверка, пожалуйста подождите"
                },
                "countmax": {
                    "func": function () {

                        $max = $("#Text").attr("data-max");
                        count = $("#Text").val().length;
                        return count <= $max;
                    },
                    "alertText": "* Кол-во символов не должно превышать :max. Набрано :count символов.",
                    "CustomAlertMessage": function () {
                        alert = "Кол-во символов не должно превышать :max. Набрано :count символов."
                        return alert;
                    }
                },
                "lessThanMax": {
                    "func": function () {
                        min = $("#min").val();
                        max = $("#max").val();
                        return parseFloat(min) < parseFloat(max);
                    },
                    "alertText": "* Минимальное значние не должно превышать максимальное."
                },
                "greaterThanMin": {
                    "func": function () {
                        min = $("#min").val();
                        max = $("#max").val();
                        return parseFloat(max) > parseFloat(min);
                    },
                    "alertText": "* Максимальное значние должно превышать минимальное."
                }, "CharValidation": {
                    "func": function () {
                        var text = $("#Text").val();
                        var LanguageType = parseInt($("#Text").parents("form").find("select[id='Language'] option:selected").val());
                        var isValid = true;

                        var Cyrillic = new RegExp('^[абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ]*$');
                        var Latin = new RegExp('^[a-zA-Z0-9]*$');
                        var validationArray = ['"', ";", ":", "'", ",", ".", "/", "?", "!", "|", "\\", "-", "=", "+", "*", "#", "%", "", "(", ")", "[", "]", " "];

                        for (var i = 0; i < text.length; i++) {
                            if (((text[i].charCodeAt(0) >= 128 && text[i].charCodeAt(0) <= 173) || Cyrillic.test(text[i]) || Latin.test(text[i]) || ($.inArray(text[i], validationArray) != -1)
                                || (!isNaN(text[i])))) {
                                isValid = true;
                            } else {
                                isValid = false;
                                break;
                            }
                        }


                        return isValid;
                    },
                    "alertText": "* Неверный символ."
                },
                "CyrillicValidation": {
                    "func": function (field) {
                        var text = field.val();
                        var isValid = true;

                        var Cyrillic = new RegExp('^[абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ]*$');

                        for (var i = 0; i < text.length; i++) {
                            if (!Cyrillic.test(text[i])) {
                                isValid = true;
                            } else {
                                isValid = false;
                                break;
                            }
                        }


                        return isValid;
                    },
                    "alertText": "Недопустимые символы - кириллица"
                },
                "lessThan": {
                    "regex": "none",
                    "alertText": "* Дата окончания вещания<br/>должна быть больше<br/>даты  начала"
                }
            };

        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);