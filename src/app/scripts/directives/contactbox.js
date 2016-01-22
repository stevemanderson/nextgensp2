'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:contactbox
 * @description
 * # contactbox
 */
angular.module('nextgensp2')
  .directive('contactbox', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/contactbox.html",
    };
  });
