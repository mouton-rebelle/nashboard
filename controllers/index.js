// app = module.parent.exports.app;
/*
 * GET home page.
 */
exports.index = function(req, res){
    var pool = require('../database').pool;

    pool.getConnection(function(err,connection)
    {
        console.log(err);
        connection.query('SELECT * FROM TIM_DAU_Loc WHERE language="pt" AND region="BR"',function(err,rows)
        {
            res.render('index', { title: 'Nashboard', daus:rows });
        });

    });
};

/*
 * GET login page.
 */
exports.login = function(req, res){
  res.render('login', { title: 'Nashboard' });
};