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
          templateUrl: 'partials/home.html'
        },
        'header@home': {
          templateUrl: 'partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'homeMain@home': {
          templateUrl: 'partials/home_main/homeMain.html',
          controller: 'HomeCtrl'
        },
        'footer@home': {
          templateUrl: 'partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
    .state('shoes', {
      url: '/shoes',
      views: {
        '': {
          template: '<h1>Hi from shoes page</h1>'
        }
      }
    })
}]);
