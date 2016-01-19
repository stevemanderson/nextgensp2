'use strict';

/**
 * @ngdoc function
 * @name sprintOneApp.controller:AutocompleteCtrl
 * @description
 * # AutocompleteCtrl
 * Controller of the sprintOneApp
 */
angular.module('sprintOneApp')
  .controller('AutoCompleteCtrl', function ($timeout, appService) {
    
    console.log("AutoCompleteCtrl >> "+appService.getServicesData());
  });
