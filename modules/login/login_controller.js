'use strict';

var loginRepository = require("./login_repository.js");
var sessionVariables = require("../../helpers/session_variables.js");
var session = require('express-session');
var globals = require("../../helpers/globals.js");
var common = require("../../helpers/common.js");

var async = require('async');

var login = {

    loginRepository: new loginRepository(),

    index: function(req,res, next){
      res.render('shared/login', globals);
    },
    createUserSession:function(req,res, next){

        if(req.method=="POST"){
            var params = {user_name : req.param("Username"), password : req.param("Password")};
            var loginSubmit = req.param("LoginSubmit");
            async.waterfall([
                async.apply(this.loginRepository.countWhere, params, this.loginRepository.table,this.loginRepository.model)
            ], function setSession(err, result){
                if(result.Count == 1){
                    req.session[sessionVariables.username] = params.user_name;
                    req.session[sessionVariables.password] = params.password;
                    req.session[sessionVariables.is_logged_in] = true;
                }
                common.redirect(res, globals.site_url);
            });
        }
        else{
            common.redirect(res, globals.site_url);
        }

    }
};

module.exports = login;
