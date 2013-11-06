module.exports = function(app,pool)
{
    /* This file maps your route matches
     * to functions defined in various
     * controller classes
     */


    ensureAuthenticated = function(req, res, next) {
      if (req.session.username) {
        return next();
      }
      return res.redirect("/login");
    };

    /* require your controllers here */
    var indexController = require('./controllers/index')(pool);
    // var adminController = require('./controllers/admin');

    /* Put routes here */

    // main site routes
    app.get('/', indexController.index);
    app.get('/login', indexController.login);

    // admin routes
    // app.get('/admin', adminController.admin);

}
