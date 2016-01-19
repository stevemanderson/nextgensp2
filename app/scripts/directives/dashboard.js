'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:dashboard
 * @description
 * # dashboard
 */
angular.module('sprintOneApp')
  .directive('dashboard', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/dashboard.html",
    };
  });
