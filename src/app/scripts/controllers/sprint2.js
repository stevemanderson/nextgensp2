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
    
  	var responseData = {};
    responseData.moduleType = "freeText"; 

    //Add contactbox
    function addContactBox(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><contactbox></contactbox></div>')($scope)); 
    }


    //Capture events from Chat modules
    $scope.$on('chatModuleEvents', function (event, data){
      console.log(data);
    });

    

    $scope.firstResponse = function(e){ 
        if(e.keyCode === 13){
            sp2Service.sendToAPIAI($scope.inputText).then(function(response) {
                console.log(response.data.result.parameters.type);
                sendQuery(response.data.result.parameters.type);
            }, function() {
                console.log("Error");
            });
        }
    }

    // Jump to tree start
    function sendQuery(data){
        
        angular.element(document.getElementById('chat-frame')).append($compile('<loading></loading>')($scope));
        var dataVar = {};
        dataVar.title = data;
        sp2Service.postQueries(dataVar).then(function(response) {
            console.log("Data > "+response.data);
            //buildChat(responseData);
        }, function() {
            console.log("Error");
            //errorChat();
        });
    }


    // Answer and jump to next node
    function sendResponse(data){
        var dataVar = {};
        dataVar.pid = 0;
        dataVar.id = 18;
        dataVar.value = "";
        
        angular.element(document.getElementById('chat-frame')).append($compile('<loading></loading>')($scope));

        sp2Service.postAnswer(dataVar).then(function(response) {
            console.log("Data > "+response.data);
            buildChat(responseData);
        }, function() {
            console.log("Error");
            errorChat();
        });
    }

    function buildChat(data){
        console.log("buildChat");
        console.log(data);
        var type = "";

        switch (data.moduleType){
            case "freeText":
                type = '<chatfreetext></chatfreetext>';
            break;
            case "default":
            case "singleShoice":
                type = '<chatsinglechoice></chatsinglechoice>';
            break;
            case "location":
                type = '<chatlocation></chatlocation>';
            break;
            case "resources":
                type = '<chatresources></chatresources>';
            break;
            case "multipleChoice":
                type = '<chatmultiplechoice></chatmultiplechoice>';
            break;
            case "summary":
                type = '<chatsummary></chatsummary>';
            break;
        }

        //Remove loader
        angular.element(document.getElementsByClassName('chat-loading')).remove();
        
        // Add new module
        angular.element(document.getElementById('chat-frame')).append($compile(type)($scope));

    }

    function errorChat(){
        //Remove loader
        angular.element(document.getElementsByClassName('chat-loading')).remove();
        // Add error module
        angular.element(document.getElementById('chat-frame')).append('<div class="error"> Sorry there was an error.</div>');
    }

    sendResponse(responseData);
        
   

});

