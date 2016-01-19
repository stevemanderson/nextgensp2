'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:slider
 * @description
 * # slider
 */
angular.module('sprintOneApp')
  .directive('slider', function ($compile) {
    return {
    restrict: 'E',
    replace: true,
    templateUrl: "partials/slider.html",
    };
  });