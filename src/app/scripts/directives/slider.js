'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:slider
 * @description
 * # slider
 */
angular.module('nextgensp2')
  .directive('slider', function ($compile) {
    return {
    restrict: 'E',
    replace: true,
    templateUrl: "partials/slider.html",
    };
  });