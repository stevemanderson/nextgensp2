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
      $scope.$emit("chatModuleEvents", $scope.query.id, id, "");
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
  .controller('ChatMultipleChoiceCtrl', ['$scope','$rootScope', 'ngDialog', 'sp2Service', function ($scope,$rootScope, ngDialog, sp2Service) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    console.log("$scope.query --> ",$scope.query.id);
       
    $scope.responses = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; }), 'rank', true);
    $scope.services = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'service'; }), 'rank', true);

    $scope.notice= {}; 
    $scope.showOk =0; 

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

    $scope.serviceClicked = function(index, response) {
      //Select service
      var dataVar = {};
      if($scope.services[index].isSelected){
        $scope.services[index].isSelected = false;
        //remove service
        dataVar = {id:response.id};
        sp2Service.removeServices(dataVar).then(function(response) {
            console.log("All Good - removed");
        }, function() {
            console.log("Error");
        });
      }else{
        $scope.services[index].isSelected = true;
        //add service
        dataVar = {id:response.id,pid:$scope.query.id};
        sp2Service.submitServices(dataVar).then(function(response) {
            console.log("All Good - Added");
        }, function() {
            console.log("Error");
        });
      }
    }

    $scope.answerClicked = function(index, response){
      $scope.responses[index].isSelected = !$scope.responses[index].isSelected;
      $scope.showOk =0;
      for(var i=0; i<$scope.responses.length; i++){
          if($scope.responses[i].isSelected){
            $scope.showOk++;
            $scope.responses[i].isUnSelected = false;
          }else{
            $scope.responses[i].isUnSelected = true;
          }
      }
    }


    $scope.infoClicked = function(title, text, $event){
      //$event.stopPropagation()
      $scope.notice= {
        title:title,
        content:text
      };

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

      $scope.$emit("chatMultiModuleEvents",$scope.query.id, ids, "");
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
  .controller('ChatOptionsCtrl', function ($scope, $location, ngDialog, $rootScope, sp2Service) {


    $scope.query = $scope.$parent.moduleData;

    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    

    $scope.responses = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; }), 'rank', true);

    $scope.summaryClicked = function() {
      $scope.sessionStats = $rootScope.sessionStats;
      $scope.$emit("summaryPanelEvent");
      

      
    }

    $scope.answerClicked = function(response){

      if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      } else {
        $scope.$emit("chatModuleEvents", $scope.query.id, response.id, "");
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
  .controller('ChatSingleChoiceCtrl', ['$scope','$rootScope', '$location', 'ngDialog','sp2Service', function ($scope, $rootScope, $location, ngDialog, sp2Service) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;

    $scope.listIndicators = ["A", "B", "C","D","E","F","G","H"];

    $scope.responses = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; }), 'rank', true);
    $scope.services = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'service'; }), 'rank', true);

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

    $scope.serviceClicked = function(index, response) {
      //Select service
      var dataVar = {};
      $scope.$emit("updateServices");
      if($scope.services[index].isSelected){
        $scope.services[index].isSelected = false;
        //remove service
        dataVar = {id:response.id};
        sp2Service.removeServices(dataVar).then(function(response) {
            console.log("All Good - removed");
            $scope.$emit("updateServices");
        }, function() {
            console.log("Error");
        });
      }else{
        $scope.services[index].isSelected = true;
        //add service
        dataVar = {id:response.id,pid:$scope.query.id};
        sp2Service.submitServices(dataVar).then(function(response) {
            console.log("All Good - Added");
            $scope.$emit("updateServices");
        }, function() {
            console.log("Error");
        });
      }
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

      console.log("--> ",$scope.query.id);

      if(response.type == 'response') {
        $scope.$emit("chatModuleEvents", $scope.query.id, response.id, "");
      }
      else if(response.type == 'linkage') {
        $scope.$emit("chatModuleLinkage", response.queryId);
      }
    }


    $scope.infoClicked = function(title, text, $event){
      //$event.stopPropagation()
      $scope.notice= {
        title:title,
        content:text
      };

      ngDialog.open({
            template:"partials/popup_notice.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-notice'
      });
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
  .controller('ChatBooleanChoiceCtrl', ['$scope','$rootScope', '$location', 'ngDialog', 'sp2Service', function ($scope, $rootScope, $location, ngDialog, sp2Service) {

    $scope.query = $scope.$parent.moduleData;
    $scope.chatModuleRef = "moduleRef_"+$scope.$parent.moduleRef;
    $scope.classes = ["btn-boolean-dark","btn-boolean-light"];

    $scope.responses = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'response' || item.type == 'linkage'; }), 'rank', true);
    $scope.services = sp2Service.sortArray($scope.query.children.filter(function(item) { return item.type == 'service'; }), 'rank', true);

    $scope.serviceClicked = function(service) {
      $rootScope.sidePanelService = service;
      //Show side menu
      $scope.$emit("chatSidePanelEvent");
    }

    $scope.answerClicked = function(response){
      if(response.type == 'response') {
        $scope.$emit("chatModuleEvents", $scope.query.id, response.id, "");
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

  /**
 * @ngdoc function
 * @name nextgensp2.controller:CallbackCtrl
 * @description
 * # CallbackCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('CallbackCtrl', function ($scope) {
    
    $scope.sendClicked = function(){
      console.log("Send it!");
    };

  });

/**
 * @ngdoc function
 * @name nextgensp2.controller:Sp3SummaryCtrl
 * @description
 * # Sp3SummaryCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('Sp3SummaryCtrl', function ($scope, $rootScope,NgMap) {
    $scope.featuredService=[];
    $scope.otherService=[];
    $scope.selectedService = {};
    for (var i=0; i< $rootScope.sessionStats.data.length; i++) {
      if(i<3){
        $scope.featuredService.push($rootScope.sessionStats.data[i]);
      }else{
        $scope.otherService.push($rootScope.sessionStats.data[i]);
      }    
    }



    //actions
    $scope.makeRefClicked = function(){
      console.log("make reference");
    };

    $scope.serviceClicked = function(index){
      $scope.selectedService = $rootScope.sessionStats.data[index];
      //Slide in service div

    };


  });
