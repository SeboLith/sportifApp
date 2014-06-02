'use strict';

var app = angular.module('app');

// Enable HTML5 Mode.
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

// configure the application using ui.router.
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('soon', {
      url: '/',
      views: {
        '': {
          templateUrl: 'partials/soon/soon.html',
          controller: 'SoonCtrl'
        },
        'slider@soon': {
          templateUrl: 'partials/soon/slider.html'
        },
        'timer@soon': {
          templateUrl: 'partials/soon/timer.html'
        }
      }
  })
    .state('home', {
      url: '/home',
      templateUrl: 'partials/member/member.html',
      controller: 'MainCtrl'
  })
    .state('memberShow', {
      url: '/member/show/:memberId',
      templateUrl: 'partials/member/show.html',
      controller: 'MemberShowCtrl'
  })
    .state('memberEdit', {
      url: '/member/edit/:memberId',
      templateUrl: 'partials/member/edit.html',
      controller: 'MemberEditCtrl'
  })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login/login.html',
      controller: 'LoginCtrl'
  })
    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
  })
    .state('signup', {
      url: '/signup',
      templateUrl: 'partials/signup/signup.html',
      controller: 'SignupCtrl'
  })
    .state('settings', {
      url: '/settings',
      templateUrl: 'partials/settings/settings.html',
      controller: 'SettingsCtrl'
  })
    .state('settings.create', {
      url: '/create-member',
      templateUrl: 'partials/settings/createMember.html'
  })
    .state('settings.pwChange', {
      url: '/change-password',
      templateUrl: 'partials/settings/changePassword.html'
  })
}]);

app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$routeChangeStart', function (event) {

    if (!Auth.isLoggedIn()) {
      event.preventDefault();
      $location.path('/login');
    }
  });
}]);

