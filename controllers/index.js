module.exports = function(app,db)
{
    // HOME PAGE
    app.get('/', function(req, res, next)
    {
        // request a db connection to the pool
        db.getConnection(function(err,connection)
        {
            // launch query
            connection.query('SELECT                        \
                                date,                       \
                                SUM(actif) AS actif,        \
                                SUM(total) AS total,        \
                                SUM(created) AS created     \
                              FROM TIM_DAU_Loc              \
                              GROUP BY date ORDER BY date DESC',function(err,rows)
            {
                connection.release();
                res.render('index', { title: 'Welcome TIM !',
                                      daus: rows,
                                      javascripts: ['daus.js']
                });
            });
        });
    });

    app.get('/login',function(req, res){
        res.render('login', { title: 'Nashboard' });
    });
};