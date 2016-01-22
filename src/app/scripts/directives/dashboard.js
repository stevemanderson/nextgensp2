'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:dashboard
 * @description
 * # dashboard
 */
angular.module('nextgensp2')
  .directive('dashboard', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/dashboard.html",
    };
  });
