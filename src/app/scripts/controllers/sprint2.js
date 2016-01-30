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

    var current_PID = 0;
    var current_ID = 0;
    var current_answer = 0;
    $scope.moduleData;
    $scope.sessionStats = {};

    $scope.firstResponse = function(e){
        if(e.keyCode === 13){
            //clear exisiting chat
            angular.element(document.getElementById('chat-frame')).empty();

            addLoader();
            sp2Service.sendToAPIAI($scope.inputText).then(function(response) {
                removeLoader();
                sendQuery(response.data.result.parameters.type);
            }, function() {
                console.log("Error");
            });
        }
    }

    // Jump to tree start
    function sendQuery(data){
        addLoader();

        var dataVar = {};
        dataVar.title = data;
        console.log(dataVar);
        sp2Service.postQueries(dataVar).then(function(response) {
            buildChat(response.data);
        }, function() {
            errorChat();
        });
    }

    // Answer and jump to next node
    function sendResponse(id, value){
        var dataVar = {};
        dataVar.pid = current_PID;
        dataVar.id = id;
        dataVar.value = value;

        addLoader();

        sp2Service.postAnswer(dataVar).then(function(response) {
            console.log("sendResponse");
            console.log(response.data);
            buildChat(response.data);
        }, function() {
            console.log("Error");
            errorChat();
        });
    }
    // Answer and jump to next node
    function sendMultiResponse(ids, value){
        var dataVar = {};
        dataVar.pid = current_PID;
        dataVar.ids = ids.toString();
        dataVar.value = value;

        addLoader();

        sp2Service.postMultiAnswer(dataVar).then(function(response) {
            console.log("sendMultiResponse");
            console.log(response.data);
            buildChat(response.data);
        }, function() {
            console.log("Error");
            errorChat();
        });
    }

    // Get session Services / Stats
    function getSessionServices(){
        sp2Service.getServices().then(function(response) {
            console.log("getSessionServices");
            console.log(response.data);
            updateStats(response.data);
        }, function() {
        });
    }

    function buildChat(data){
        console.log("buildChat");

        //Update session services
        //getSessionServices();

        current_PID = data.id;
        $scope.moduleData = data;
        var type = "";

        switch (data.format){
            case "freeText":
                type = '<chatfreetext ></chatfreetext>';
            break;
            case "location":
                type = '<chatlocation></chatlocation>';
            break;
            case "resources":
                type = '<chatresources></chatresources>';
            break;
            case "multiple choice":
                type = '<chatmultiplechoice></chatmultiplechoice>';
            break;
            case "summary":
                type = '<chatsummary></chatsummary>';
            break;
            case "singleShoice":
            default:
                type = '<chatsinglechoice ng-model="moduleData"></chatsinglechoice>';

        }

        //Remove loader
        removeLoader();

        var options = '<chatoptions></chatoptions>';

        // Add new module
        angular.element(document.getElementById('chat-frame')).append($compile(type)($scope));
        angular.element(document.getElementById('chat-frame')).append($compile(options)($scope));
    }

    function addLoader(){
        angular.element(document.getElementById('chat-frame')).append($compile('<loading></loading>')($scope));
    }

    function removeLoader(){
        angular.element(document.getElementsByClassName('chat-loading')).remove();
    }

    function errorChat(){
        //Remove loader
        angular.element(document.getElementsByClassName('chat-loading')).remove();
        // Add error module
        angular.element(document.getElementById('chat-frame')).append('<div class="error"> Sorry there was an error.</div>');
    }

    function updateStats(data){
        console.log("updateStats");
        console.log(data);
        $scope.sessionStats;
    }



    //Events

    //Capture events from Chat modules
    $scope.$on('chatModuleEvents', function (event, id, value){
      sendResponse(id, value);
    });

    //Capture event from multi choice modules
    $scope.$on('chatMultiModuleEvents', function (event, ids, value){
      sendMultiResponse(ids, value);
    });

    // Actions

    // Jump section
    $scope.jumpSectionClicked = function(){

    };

    // Save clicked
    $scope.saveClicked  = function(){

    };

    // Expand section
    $scope.expandSectionClicked = function(){

    };

});
