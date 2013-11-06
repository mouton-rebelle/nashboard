var pool;

exports.pool = function() {
    if (!pool)
    {
        pool = require('mysql').createPool(require('./config').databases.STATS_DAU_MAU);
        pool.on('connection',function(err){
            console.log('MYSQL CONNECTED');
        });
    }
    return pool;
} ();


exports.daus = function( config, callback)
{
    var defaultConfig = {language:null,region:null};
}
