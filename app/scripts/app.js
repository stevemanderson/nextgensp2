'use strict';

/**
 * @ngdoc overview
 * @name sprintOneApp
 * @description
 * # sprintOneApp
 *
 * Main module of the application.
 */
angular
  .module('sprintOneApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMap',
    'slick',
    'luegg.directives',
    'masonry'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl',
        controllerAs: 'chat'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/account-summary', {
        templateUrl: 'views/account-summary.html',
        controller: 'AccountSummaryCtrl',
        controllerAs: 'accountsummary'
      })
      .when('/available-survices', {
        templateUrl: 'views/available-services.html',
        controller: 'AccountSummaryCtrl',
        controllerAs: 'accountsummary'
      })
      .when('/account-privacy', {
        templateUrl: 'views/account-privacy.html',
        controller: 'AccountSummaryCtrl',
        controllerAs: 'accountsummary'
      })
      
      .otherwise({
        redirectTo: '/chat'
      });
  });
