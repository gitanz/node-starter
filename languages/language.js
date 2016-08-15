'use strict';

var english = require("./english.js");
var russian = require("./russian.js");
var cookie_variables = require("../helpers/cookie_variables.js");

var language = {

    getDefaultLanguage:function(){

        var language_set;

        if(cookie_variables.default == cookie_variables.english)
            language_set = english;

        else if(cookie_variables.default == cookie_variables.russian)
            language_set = russian;

        return language_set;
    },

    getLanguage:function(req, callback){

        var language_set;

        if(req.cookies[cookie_variables.language]!=null && req.cookies[cookie_variables.language].length > 0){

            if(req.cookies[cookie_variables.language] != cookie_variables.default){

                if(req.cookies[cookie_variables.language] == cookie_variables.english){

                    language_set = english;

                }else if(req.cookies[cookie_variables.language]== cookie_variables.russian){

                    language_set = russian;

                } else{

                    language_set = this.getDefaultLanguage();

                }
            }else{

                language_set = this.getDefaultLanguage();

            }
        }else{

            language_set = this.getDefaultLanguage();

        }

        callback(language_set);

    }

};

module.exports = language;

