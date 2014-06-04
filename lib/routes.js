'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    products = require('./controllers/products'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // products API Routes
  app.route('/api/products')
    .get(products.getAll)
    .post(products.create);
  app.route('/api/products/:id')
    .get(products.getOne)
    .put(products.update)
    .delete(products.remove);

  // users API Routes
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  // session API Routes
  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};