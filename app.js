'use strict';

/*
* include all libraries needed
*/
var request = require('request');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var mysql = require('mysql');
var crypto = require('crypto');
var sessionVariables = require("./helpers/session_variables.js");
var session = require('express-session');
var globals = require('./helpers/globals.js');
var common = require('./helpers/common.js');
var language = require('./languages/language.js');


var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'iu0wensldkmvaovmskdfgj', cookie:{secure:"auto"}, resave:true, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));

/*
* middleware for language
* check check Language Cookie
*/
app.use(function(req, res, next){
    language.getLanguage(req, function(language_set){
        globals.language = language_set;
    });
    next();
});

/*
* addition of routing middleware
* grab request : url
* route as http://site_url/:controller/:method
* */
var defaultPage = "index";
var defaultMethod = "index";
var controllerName;
var controller;
var method;
app.use(function(req, res, next){
    var uriParts = url.parse(req.url).path.split("/");
    controllerName = uriParts[1] == "" || uriParts[1] == null ? defaultPage : uriParts[1].trim();
    method = uriParts[2]=="" || uriParts[2] == null ? defaultMethod : uriParts[2].trim();
    try{
        controller = require("./modules/"+controllerName+"/"+controllerName+"_controller.js");
        next();
    }catch (exception){
        next();
    }
});


/*
* set base directory for view files as views folder
* set view engine to `ejs` : embedded javascript
* ejs - is similar to html
* use <%= var %> to echo variables sent from server
* other view engines : jade - has its own html syntax for rendering
* */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/* filtering middleware */

app.use(function(req, res, next){

    /*
    * in case when session is set and user requested login page
    * redirect user to home page
    */
    if(
        (req.session.is_logged_in != null && req.session.is_logged_in != false) &&
        (controllerName.toLocaleLowerCase() == "login")
    ){
        common.redirect(res, globals.site_url);
    }

    /*
     * in case when session is not set
     * redirect user to login page
     */
     if(
         (req.session.is_logged_in == null || req.session.is_logged_in == false) &&
         (controllerName.toLocaleLowerCase() != "login")
     ){
         controller = require("./modules/login/login_controller.js");
         method = "index";
     }
    next();
});

/*
* adding csrf (Cross Site Request Forgery) middleware
* when user tries to submit form to this site in any other way
*/
var csrf_token;
app.use(function(req, res, next){
    if(req.session[sessionVariables.csrf_token] == null || req.session[sessionVariables.csrf_token] == ""){
        csrf_token = crypto.createHash('md5').update(Math.random(1,1000)+"whatever").digest("hex");
        req.session[sessionVariables.csrf_token]= csrf_token;
    }else{
        csrf_token = req.session[sessionVariables.csrf_token];
    }
    app.locals.csrf_token = csrf_token;
    next();
});


/*
* call controller method to complete request
* */
app.use(function(req, res, next){
    controller[method](req,res,next);
});

/*
* if controller not found i.e in case when above handler won't work
* catch 404 and forward to error handler
* */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/*
* error handlers
* developement error handle _ will print stack traces
*/

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/*
* production error handler
* will not print stack traces
*/
app.use(function(err, req, res, next) {
  console.log(res.status);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
* finally export app module
*/
module.exports = app;
