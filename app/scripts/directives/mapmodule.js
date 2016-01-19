'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:mapmodule
 * @description
 * # mapmodule
 */
angular.module('sprintOneApp')
  .directive('mapmodule', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/mapmodule.html",
    };
  });
