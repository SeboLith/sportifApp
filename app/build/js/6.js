"use strict";var app=angular.module("SportifStore");app.config(["$locationProvider",function(a){a.html5Mode(!0)}]),app.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",views:{"":{templateUrl:"../views/partials/home.html"},"header@home":{templateUrl:"../views/partials/header/header.html",controller:"HeaderCtrl"},"homeMain@home":{templateUrl:"../views/partials/home_main/homeMain.html",controller:"HomeCtrl"},"footer@home":{templateUrl:"../views/partials/footer/footer.html",controller:"FooterCtrl"}}}).state("shoes",{url:"/shoes",views:{"":{templateUrl:"../views/partials/shoes.html"},"header@home":{templateUrl:"../views/partials/header/header.html",controller:"HeaderCtrl"},"homeMain@home":{templateUrl:"../views/partials/home_main/homeMain.html",controller:"HomeCtrl"},"footer@home":{templateUrl:"../views/partials/footer/footer.html",controller:"FooterCtrl"}}})}]);