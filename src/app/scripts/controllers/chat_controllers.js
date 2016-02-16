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

  });

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatLocationCtrl
 * @description
 * # ChatLocationCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatLocationCtrl', function ($scope, NgMap, $timeout, $rootScope, ngDialog) {
    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;
    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response'; })

    $scope.autoCompleteVal={};
    $scope.geolocation = {};
    $scope.showMap = false;

    $scope.notice= {
      title:"Information we collect ",
      content:"<p>When you use Husky we might ask for personal information. We use this inside the app (we don’t see it), in notification emails to you and and people you choose and for authenticating your identity to sign you into your account.</p><p>We don&#8217;t save this information or any preferences you might set or use for any other purpose (except to comply with a subpoena under the law.)</p><p>We will not rent, sell or distribute your information to anyone without your express permission.</p>"
    }

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

    $scope.noticeClicked =  function(){
      ngDialog.open({
            template:"partials/popup_notice.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-notice'
          });
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
  .controller('ChatMultipleChoiceCtrl', ['$scope','$rootScope', 'ngDialog', function ($scope,$rootScope, ngDialog) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });

    $scope.notice= {};    

    $scope.numberLoaded = true;
    $scope.slickConfig = {
        enabled: true,
        autoplay: false,
        draggable: true, 
        slidesToShow: 1,
        slidesToScroll: 1, 
        arrows : false,
        dots: true
    };

    $scope.serviceClicked = function(service) {
      $rootScope.sidePanelService = service;
      
      //Show side menu
      $scope.$emit("chatSidePanelEvent");
    }

    $scope.answerClicked = function(index, response){
      $scope.query.children[index].isSelected = !$scope.query.children[index].isSelected;
    }


    $scope.infoClicked = function(title, text, $event){
      //$event.stopPropagation()
      $scope.notice= {
        title:title,
        content:text
      };
      console.log("--> ",$scope.notice);

      ngDialog.open({
            template:"partials/popup_notice.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-notice'
      });
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

    $scope.listIndicators = ["A", "B", "C","D","E","F","G","H"];

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
        $scope.responses[i].isUnSelected = false;
      }
    }

    reset();

    $scope.answerClicked = function(index, response){
      reset();

      for(var i=0; i<$scope.responses.length; i++){
        if(index !== i){
          $scope.responses[i].isUnSelected = true;
        }
      }

      $scope.responses[index].isSelected = true;

      if(response.type == 'response') {
        $scope.$emit("chatModuleEvents", response.id, "");
      }
      else if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      }
    }
  }]);

  /**
 * @ngdoc function
 * @name nextgensp2.controller:ChatBooleanChoiceCtrl
 * @description
 * # ChatSingleChoiceCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatBooleanChoiceCtrl', ['$scope','$rootScope', '$location', 'ngDialog', function ($scope, $rootScope, $location, ngDialog) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;
    $scope.classes = ["btn-boolean-dark","btn-boolean-light"];

    $scope.responses = $scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; });
    $scope.services = $scope.query.children.filter(function(item) { return item.type == 'service'; });


    $scope.serviceClicked = function(service) {
      $rootScope.sidePanelService = service;
      //Show side menu
      $scope.$emit("chatSidePanelEvent");
    }

    $scope.answerClicked = function(response){
      if(response.type == 'response') {
        $scope.$emit("chatModuleEvents", response.id, "");
      }
      else if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      }
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


