'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:signinpanel
 * @description
 * # signinpanel
 */
angular.module('sprintOneApp')
  .directive('signinpanel', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/signinpanel.html",
		controller: 'SigninpanelCtrl',
    };
  });