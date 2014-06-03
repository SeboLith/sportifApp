'use strict';

var app = angular.module('SportifStore');

// Enable HTML5 Mode.
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

// configure the application using ui.router.
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../views/partials/home.html',
      controller: 'HomeCtrl'
  })
}]);
