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
          templateUrl: 'views/partials/home.html'
        },
        'header@home': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'homeMain@home': {
          templateUrl: 'views/partials/home_main/homeMain.html',
          controller: 'HomeCtrl'
        },
        'footer@home': {
          templateUrl: 'views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
    .state('shoes', {
      url: '/shoes',
      views: {
        '': {
          templateUrl: 'views/partials/shoes.html'
        },
        'header@shoes': {
          templateUrl: 'views/partials/header/header.html',
          controller: 'HeaderCtrl'
        },
        'shoesMain@shoes': {
          templateUrl: 'views/partials/shoes_main/shoesMain.html'
          // controller: 'HomeCtrl'
        },
        'footer@shoes': {
          templateUrl: 'views/partials/footer/footer.html',
          controller: 'FooterCtrl'
        }
      }
    })
}]);
