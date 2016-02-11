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
    $scope.init = function () {
         $scope.$emit("scrollNewModule", "chat-loading");
    };
  });

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatLocationCtrl
 * @description
 * # ChatLocationCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatLocationCtrl', function ($scope, NgMap, $timeout, $rootScope) {
    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;
    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; })

    $scope.autoCompleteVal={};
    $scope.geolocation = {};
    $scope.showMap = false;
    $scope.$on('g-places-autocomplete:select', function (event, data){

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
        $rootScope.businessLocation = $scope.autoCompleteVal.formatted_address;
        
        $scope.$emit("scrollNewModule", "location-answers");
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

      reset();
      $scope.responses[index].isSelected = true;
      $scope.$emit("chatModuleEvents", id, "");
    }
    $scope.init = function () {
         $scope.$emit("scrollNewModule", $scope.chatModuleRef);
    };
  });



/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatMultipleChoiceCtrl
 * @description
 * # ChatMultipleChoiceCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatMultipleChoiceCtrl', ['$scope','$rootScope', 'ngDialog', function ($scope,$rootScope, $location, ngDialog) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });

    $scope.serviceClicked = function(service) {
      $rootScope.sidePanelService = service;
      
      //Show side menu
      $scope.$emit("chatSidePanelEvent");
    }

    $scope.answerClicked = function(index, response){
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

      $scope.$emit("chatMultiModuleEvents", ids, "");
    }

    $scope.init = function () {
         $scope.$emit("scrollNewModule", $scope.chatModuleRef);
    };

  }]);

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatResourcesCtrl
 * @description
 * # ChatResourcesCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatResourcesCtrl', function ($scope, $location) {

  });


angular.module('nextgensp2')
  .controller('ChatOptionsCtrl', function ($scope, $location, ngDialog, $rootScope) {


    $scope.query = $scope.$parent.moduleData;

    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; });

    $scope.summaryClicked = function() {
      $scope.sessionStats = $rootScope.sessionStats;
      $scope.$emit("summaryPanelEvent");
      

      
    }

    $scope.answerClicked = function(response){

      if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      } else {
        $scope.$emit("chatModuleEvents", response.id, "");
      }
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
  .controller('ChatSingleChoiceCtrl', ['$scope','$rootScope', '$location', 'ngDialog', function ($scope, $rootScope, $location, ngDialog) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;
    console.log('chatsingle - init 1',$scope.chatModuleRef);


    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });

    $scope.serviceClicked = function(service) {
      $rootScope.sidePanelService = service;
      
      //Show side menu
      $scope.$emit("chatSidePanelEvent");
    }

    function reset(){
      //reset selection
      for(var i=0; i<$scope.responses.length; i++){
        $scope.responses[i].isSelected = false;
      }
    }

    reset();

    $scope.answerClicked = function(index, response){
      reset();
      $scope.responses[index].isSelected = true;

      if(response.type == 'response') {
        $scope.$emit("chatModuleEvents", response.id, "");
      }
      else if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      }
    }
    $scope.init = function () {
      console.log('chatsingle - init ',$scope.chatModuleRef);
      $scope.$emit("scrollNewModule", $scope.chatModuleRef);
    };
  }]);

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatSummaryCtrl
 * @description
 * # ChatSummaryCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatSummaryCtrl', function ($scope, $location) {

  });
/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatSummaryCtrl
 * @description
 * # ChatSummaryCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('SidePanelCtrl', function ($scope) {
    
    $scope.closeClicked = function(){

      $scope.$emit("chatSidePanelEvent");
    };

  });


