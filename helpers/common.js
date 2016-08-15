var common = {

    redirect : function redirect(res, url){
        res.writeHead(302, {'Location': url});
        res.end();
    },

    translate: function(key){
        var english = require('../languages/english.js');

    }

};

module.exports = common;
