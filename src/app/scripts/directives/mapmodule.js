'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:mapmodule
 * @description
 * # mapmodule
 */
angular.module('nextgensp2')
  .directive('mapmodule', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/mapmodule.html",
    };
  });
