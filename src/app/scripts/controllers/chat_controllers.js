'use strict';

function getTypeArray(array, type) {
  var result = [];
  for(var i=0; i < array.length; ++i) {
    var item = array[i];
    if(item.type == type) {
      result.push(item);
    }
  }
  return result;
}

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
        $scope.$emit("chatModuleEvents", $scope.query.children[2].id, "");
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
  .controller('ChatMultipleChoiceCtrl', function ($scope, $location, loginservice) {
    console.log('ChatMultipleChoiceCtrl');
    console.log($scope.$parent.moduleData);

    $scope.query = $scope.$parent.moduleData;

    $scope.responses = getTypeArray($scope.query.children, 'response');
    $scope.services = getTypeArray($scope.query.children, 'service');

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
  });

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
  .controller('ChatOptionsCtrl', function ($scope, $location) {
    console.log("ChatOptionsCtrl");

    $scope.query = $scope.$parent.moduleData;

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
  .controller('ChatSingleChoiceCtrl', function ($scope, $location,loginservice) {
    console.log('ChatSingleChoiceCtrl');
    console.log($scope.$parent.moduleData);
    $scope.query = $scope.$parent.moduleData;
    $scope.responses = getTypeArray($scope.query.children, 'response');
    $scope.services = getTypeArray($scope.query.children, 'service');

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


  });

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
