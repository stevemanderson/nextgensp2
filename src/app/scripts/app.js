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
    'ngDialog',
    'ngTouch',
    'ngMap',
    'angularUUID2',
    'google.places',
    'smoothScroll',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster',
    'slickCarousel'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/sprint2', {
        templateUrl: 'views/sprint2.html',
        controller: 'Sprint2Ctrl'
      })
      .when('/graph', {
        templateUrl: 'views/graph.html',
        controller: 'GraphController'
      })
      .when('/apiai', {
        templateUrl: 'views/apiai.html'
      })
      .when('/video', {
        templateUrl: 'views/video.html',
        controller: 'VideoCtrl'
      })

      .otherwise({
        redirectTo: '/sprint2'
      });
  });
