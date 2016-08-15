'use strict';

var express = require('express');

var index = {

  index: function(req,res, next){

    res.send("index");

    // if(req.session.isLoggedIn != null && req.session.isLoggedIn == true ){
    //
    //   viewParams = { title: 'Express' };
    //
    //   res.render('shared/header', viewParams);
    //
    // }else{
    //
    //   viewParams = { title: 'Express' };
    //
    //   res.render('shared/login', viewParams);
    //
    // }
    //
    // next();

  },

  save:function(req,res,next){

    res.send("save");

  }
};

module.exports = index;
