
/**
 * Module dependencies.
 */

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    http = require('http'),
    path = require('path');

var app = express();

var pool = require('mysql').createPool(require('./config').databases.STATS_DAU_MAU);
pool.on('connection',function(err){
    console.log('MYSQL CONNECTED');
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var indexController = require('./controllers/index')(app,pool);