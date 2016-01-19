'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:locationbox
 * @description
 * # locationbox
 */
angular.module('sprintOneApp')
  .directive('locationbox', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/locationbox.html",
    };
  });