module.exports = function(app,db)
{
    app.get('/', function(req, res, next)
    {
        db.getConnection(function(err,connection)
        {
            connection.query('SELECT * FROM TIM_DAU_Loc WHERE language="pt" AND region="BR"',function(err,rows)
            {
                connection.release();
                res.render('index', { title: 'Nashboard', daus:rows });
            });
        });
    });

    app.get('/login',function(req, res){
        res.render('login', { title: 'Nashboard' });
    });
};