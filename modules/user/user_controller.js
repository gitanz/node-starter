'use strict';

var express = require('express');
var globals = require('../../helpers/globals.js');
var common = require('../../helpers/common.js');

var users= {

  index: function(req,res, next){

     globals.view_params.page_title = 'User Management';

     res.render('users/index', globals);

     next();

  },

  save:function(req,res,next){

    res.send("userssave");

  }

};

module.exports = users;

