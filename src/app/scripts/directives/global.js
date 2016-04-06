'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:govheader
 * @description
 * # govheader
 */
angular.module('nextgensp2')
  .directive('govheader', function () {
    return {
      restrict: 'E',
      templateUrl: "partials/govheader.html",
      controller: "GovheaderCtrl",
    };
  });
