'use strict';

var BaseModel = require('../helpers/base_model.js');

var util = require('util');

function Users(){

    BaseModel.call(this);
    
    this.id = null;

    this.user_name = null;

    this.password = null;

    this.last_login = null;

}

util.inherits(Users, BaseModel);

module.exports = Users;