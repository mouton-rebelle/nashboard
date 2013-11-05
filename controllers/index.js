/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Nashboard' });
};

/*
 * GET login page.
 */
exports.login = function(req, res){
  res.render('login', { title: 'Nashboard' });
};