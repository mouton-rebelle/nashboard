/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */
app = module.parent.exports.app;

/* require your controllers here */
var indexController = require('./controllers/index');
// var adminController = require('./controllers/admin');

/* Put routes here */

// main site routes
app.get('/', indexController.index);
app.get('/login', indexController.login);

// admin routes
// app.get('/admin', adminController.admin);