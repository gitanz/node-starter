'use strict';

var util = require("util");

var BaseRepository = require("../../helpers/base_repository.js");

var Users = require("../../models/users.js");

function LoginRepository()
{
    this.table = "users";
    this.model = new Users;
    BaseRepository.call(this);
}

util.inherits(LoginRepository, BaseRepository);

module.exports = LoginRepository;