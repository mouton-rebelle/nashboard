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
                                      javascripts: ['chart.js','index.js']
                });
            });
        });
    });

    // JSON
    app.get('/json', function(req, res, next)
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
                              WHERE date BETWEEN ? AND ?    \
                              GROUP BY date ORDER BY date DESC',[req.query.date_start,req.query.date_end],function(err,rows)
            {
                connection.release();
                if (err) res.json(err);
                res.json(rows);
            });
        });
    });


    app.get('/login',function(req, res){
        res.render('login', { title: 'Nashboard' });
    });
};