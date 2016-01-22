'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:locationslider
 * @description
 * # locationslider
 */
angular.module('nextgensp2')
  .directive('locationslider', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/locationslider.html",
    };
  });
