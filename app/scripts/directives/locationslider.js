'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:locationslider
 * @description
 * # locationslider
 */
angular.module('sprintOneApp')
  .directive('locationslider', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/locationslider.html",
    };
  });
