'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatFreeTextCtrl
 * @description
 * # ChatFreeTextCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatFreeTextCtrl', function ($scope) {
    console.log('ChatFreeTextCtrl');
  });

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatLoadingCtrl
 * @description
 * # ChatLoadingCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatLoadingCtrl', function ($scope) {

  });

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatLocationCtrl
 * @description
 * # ChatLocationCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatLocationCtrl', function ($scope,loginservice, NgMap, $timeout) {
    $scope.query = $scope.$parent.moduleData;
    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; })
    
    $scope.autoCompleteVal={};
    $scope.geolocation = {};
    $scope.showMap = false;


    $scope.$on('g-places-autocomplete:select', function (event, data){
      console.log(data);
      $timeout(function timoutCall(){
          updateMap();
        }, 300);
    });

    function updateMap(){
      $scope.geolocation.latlngStr = $scope.autoCompleteVal.geometry.location.lat()+","+$scope.autoCompleteVal.geometry.location.lng();
      $scope.geolocation.latlngObj = new google.maps.LatLng($scope.autoCompleteVal.geometry.location.lat(), $scope.autoCompleteVal.geometry.location.lng());
      $scope.showMap = true;
      $timeout(function timoutCall(){
        google.maps.event.trigger($scope.map, 'resize');
        $scope.map.setCenter($scope.geolocation.latlngObj);
        // Hard coded to select BCC option
        //$scope.$emit("chatModuleEvents", $scope.query.children[2].id, "");
      });
    }

    $scope.answerClicked = function(index, id){
      console.log(index, id);
      //reset();
      $scope.responses[index].isSelected = true;
      $scope.$emit("chatModuleEvents", id, "");
    }

  });



/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatMultipleChoiceCtrl
 * @description
 * # ChatMultipleChoiceCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatMultipleChoiceCtrl', ['$scope', '$location', 'loginservice', 'ngDialog', function ($scope, $location, loginservice, ngDialog) {
    console.log('ChatMultipleChoiceCtrl');
    console.log($scope.$parent.moduleData);

    $scope.query = $scope.$parent.moduleData;

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });

    $scope.serviceClicked = function(service) {
      $scope.service = service;
      ngDialog.open({
        template:"partials/service_information.html",
        scope:$scope
      });
    }

    $scope.answerClicked = function(index, id){
      console.log(index, id);
      $scope.query.children[index].isSelected = !$scope.query.children[index].isSelected;
    }

    $scope.okClicked = function(){
      //Look through and get selected
      var ids=[];
      for(var i=0; i<$scope.query.children.length; i++){
        if($scope.query.children[i].isSelected){
          ids.push($scope.query.children[i].id);
        }
      }
      console.log("okClicked");
      console.log(ids);
      $scope.$emit("chatMultiModuleEvents", ids, "");
    }
  }]);

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatResourcesCtrl
 * @description
 * # ChatResourcesCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatResourcesCtrl', function ($scope, $location,loginservice) {
    console.log('ChatResourcesCtrl');
  });


angular.module('nextgensp2')
  .controller('ChatOptionsCtrl', function ($scope, $location, ngDialog, $rootScope) {
    console.log("ChatOptionsCtrl");

    $scope.query = $scope.$parent.moduleData;
    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; })

    $scope.summaryClicked = function() {
      $scope.sessionStats = $rootScope.sessionStats;
      console.log(JSON.stringify($scope.sessionStats));
      ngDialog.open({
        template:"partials/chat_summary.html",
        scope:$scope
      });
    }

    $scope.answerClicked = function(response){
      $scope.$emit("chatModuleEvents", response.id, "");
    }
  });


/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatSingleChoiceCtrl
 * @description
 * # ChatSingleChoiceCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatSingleChoiceCtrl', ['$scope', '$location', 'loginservice', 'ngDialog', function ($scope, $location,loginservice, ngDialog) {
    console.log('ChatSingleChoiceCtrl');
    console.log($scope.$parent.moduleData);
    $scope.query = $scope.$parent.moduleData;

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });

    $scope.serviceClicked = function(service) {
      $scope.service = service;
      ngDialog.open({
        template:"partials/service_information.html",
        scope:$scope
      });
    }

    function reset(){
      //reset selection
      for(var i=0; i<$scope.responses.length; i++){
        $scope.responses[i].isSelected = false;
      }
    }

    reset();

    $scope.answerClicked = function(index, id){
      console.log(index, id);
      reset();
      $scope.responses[index].isSelected = true;
      $scope.$emit("chatModuleEvents", id, "");
    }

  }]);

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatSummaryCtrl
 * @description
 * # ChatSummaryCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatSummaryCtrl', function ($scope, $location,loginservice) {
    console.log('ChatSummaryCtrl');

  });
