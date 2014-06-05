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
      views: {
        '': {
          templateUrl: '../views/partials/home.html',
          controller: 'HomeCtrl'
        },
        'colorbox@home': {
          templateUrl: '../views/partials/colorbox/colorbox.html'
        },
        'header@home': {
          templateUrl: '../views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'homeMain@home': {
          templateUrl: '../views/partials/home_main/homeMain.html'
        },
        'footer@home': {
          templateUrl: '../views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
}]);
