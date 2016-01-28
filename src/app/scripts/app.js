'use strict';

/**
 * @ngdoc overview
 * @name nextgensp2
 * @description
 * # nextgensp2
 *
 * Main module of the application.
 */
angular
  .module('nextgensp2', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMap',
    'slick',
    'luegg.directives',
    'masonry',
    'angularUUID2',
    'google.places'
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
      .when('/sprint2', {
        templateUrl: 'views/sprint2.html',
        controller: 'Sprint2Ctrl'
      })
      .when('/apiai', {
        templateUrl: 'views/apiai.html'
      })
      
      .otherwise({
        redirectTo: '/sprint2'
      });
  });
