'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('Sprint2Ctrl', function ($scope, sp2Service,  $compile) {
    
  	

    //Add contactbox
    function addContactBox(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><contactbox></contactbox></div>')($scope)); 
    }


    //Capture events from Chat modules
    $scope.$on('chatModuleEvents', function (event, data){
      console.log(data);
    });


    //'{"pid":21,"id":22, "value":"String"}';
    var dataVar = {};
    dataVar.pid = 21;
    dataVar.id = 22;
    dataVar.value = "String";

    sp2Service.postAnswer(dataVar).then(function(response) {
                console.log("Data > "+response.data);
            }, function() {
                console.log("Fail");
            });


});

