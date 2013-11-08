
/**
 * Module dependencies.
 */

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    moment = require('moment'),
    http = require('http'),
    path = require('path');

var app = express();

var pool = require('mysql').createPool(require('./config').databases.STATS_DAU_MAU);
pool.on('connection',function(err){
    console.log('MYSQL CONNECTED');
});

hbs = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        formatDate: function (datetime, format) {
            return moment(datetime).format(format);
        },
        formatNumber: function(num)
        {
            var p = num+'';
            return p.split("").reverse().reduce(function(acc, num, i, orig) {
              return  num + (i && !(i % 3) ? "," : "") + acc;
            }, "");
        },
        json: function(obj) {
            return JSON.stringify(obj);
        }
    }
});



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
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

livereload = require('livereload');
server = livereload.createServer();
server.watch(__dirname + "/public");

var indexController = require('./controllers/index')(app,pool);