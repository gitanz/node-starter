mysql = require('mysql');

function BaseRepository()
{
    this.connection = null;

}


BaseRepository.prototype.getConnection = function(){

    if(this.connection == null){
        this.connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'web_advertisement_interface'
        });
    }
    return this.connection;

};



BaseRepository.prototype.getById = function(id, tableName){

    if(tableName == null){
        tableName = this.table;
    }

    sql = "SELECT * FROM "+tableName+" WHERE id = "+id;


};

BaseRepository.prototype.where = function(whereObject, tableName){

    if(tableName == null){
        tableName = this.table;
    }
    sql = " SELECT * FROM  " +tableName +" WHERE 1=1 ";
    for(var key in whereObject){
        if(whereObject.hasOwnProperty(key)){
            sql += " AND "+key+" = "+whereObject[key]
        }
    }

};

BaseRepository.prototype.countWhere = function(whereObject, tableName, model, callback){

    if(tableName == null){
        tableName = this.table;
    }

    if(model == null){
        model = this.model;
    }

    sql = " SELECT COUNT(*) as Count FROM  `" +tableName +"` WHERE 1=1 ";

    for(var key in whereObject){
        if(whereObject.hasOwnProperty(key)){
            sql += " AND `"+key+"` = '"+whereObject[key].trim()+"'"
        }
    }

    BaseRepository.prototype.getConnection().query(sql, function(err, rows, fields){

        if(err){
            callback(err, null);
        }
        var result = {"Count":rows[0].Count};

        callback(null, result);

    });

};


module.exports = BaseRepository;