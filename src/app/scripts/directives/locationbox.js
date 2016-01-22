'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:locationbox
 * @description
 * # locationbox
 */
angular.module('nextgensp2')
  .directive('locationbox', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/locationbox.html",
    };
  });