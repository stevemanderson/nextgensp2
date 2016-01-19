'use strict';

/**
 * @ngdoc directive
 * @name sprintOneApp.directive:contactbox
 * @description
 * # contactbox
 */
angular.module('sprintOneApp')
  .directive('contactbox', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/contactbox.html",
    };
  });
