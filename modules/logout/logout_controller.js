'use strict';

var sessionVariables = require("../../helpers/session_variables.js");
var session = require('express-session');
var globals = require("../../helpers/globals.js");
var common = require("../../helpers/common.js");

var Logout = {

    index: function(req,res, next){
        delete req.session[sessionVariables.username];
        delete req.session[sessionVariables.password];
        delete req.session[sessionVariables.is_logged_in];
        console.log("hehahaha");
        common.redirect(res,globals.site_url);
    }
};

module.exports = Logout;
