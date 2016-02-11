'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('Sprint2Ctrl', function ($scope, sp2Service,  $compile, $rootScope, ngDialog, $location,smoothScroll,$timeout) {

  	var responseData = {};
    responseData.moduleType = "freeText";

    var current_PID = 0;
    var current_ID = 0;
    var current_answer = 0;
    $scope.moduleRef = 0;
    $scope.currentModuleRef = 0;

    $scope.moduleData;
    $scope.sessionStats = {};
    $scope.inputText = "";

    $rootScope.businessLocation = "";

    $scope.topbars = {
        serviceAlert:true,
        summary:false
    };
    $scope.enterTxt = false;

    $scope.firstResponse = function(e){
        if(e.keyCode === 13){
            //clear exisiting chat
            angular.element(document.getElementById('chat-frame')).empty();

            addLoader();
            sp2Service.sendToAPIAI($scope.inputText).then(function(response) {
                console.log(response);
                removeLoader();
                //Swap Top bars
                $scope.topbars= {
                    serviceAlert:false,
                    summary:true
                };
                if (response.data.result.action === "input.unknown") {
                    errorChat('Sorry that input is unknown.');
                }else{
                    sendQuery({title:response.data.result.parameters.type});
                }
                
            }, function() {
                errorChat();
            });
        }

        if($scope.inputText.length > 2){
            $scope.enterTxt=true;
        }else{
            $scope.enterTxt=false;
        }

    }

    // Jump to tree start
    function sendQuery(data){
        addLoader();

        var dataVar = {};
        if(data.hasOwnProperty('id')) { dataVar.id = data.id; }
        if(data.hasOwnProperty('title')) { dataVar.title = data.title; }

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
            console.log(response.data);
            buildChat(response.data);
        }, function() {
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
        //Update session services
        getSessionServices();

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

        $scope.moduleRef++;
        $scope.currentModuleRef = $scope.moduleRef;
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

    function errorChat(errorTxt){
        //Remove loader
        angular.element(document.getElementsByClassName('chat-loading')).remove();
        // Add error module
        if(errorTxt === null){
            angular.element(document.getElementById('chat-frame')).append('<div class="error"> Sorry there was an error.</div>');
        }else{
            angular.element(document.getElementById('chat-frame')).append('<div class="error">'+errorTxt+'</div>');
        }
        
    }

    function updateStats(data){
        var cost_min = 0;
        var cost_max = 0;
        var steps = data.length;
        for(var i = 0; i < data.length; ++i) {
          var item = data[i];
          if(item.cost_min) {
            cost_min += parseInt(item.cost_min);
          }
          if(item.cost_max) {
            cost_max += parseInt(item.cost_max);
          }
        }
        $rootScope.sessionStats = {
          cost_min:cost_min,
          cost_max:cost_max,
          number_steps:steps
        };
    }
    
    //Show side panel info
    function sidePanelToggle(){
        if(angular.element(document.getElementById('myNavmenu')).hasClass('canvas-slid')){
            //close
            angular.element(document.getElementsByTagName('footer')).css({bottom: '1px'});

        }else{
            //open
            angular.element(document.getElementsByTagName('footer')).css({bottom: 'auto'});

        }
    }

    //Events
    $scope.$on('chatModuleLinkage', function(event, id) {
        sendQuery({id:id});
    });

    //Capture events from Chat modules
    $scope.$on('chatModuleEvents', function (event, id, value){
        sendResponse(id, value);
    });

    //Capture event from multi choice modules
    $scope.$on('chatMultiModuleEvents', function (event, ids, value){
        sendMultiResponse(ids, value);
    });

    //Toggle Side panel
    $scope.$on('chatSidePanelEvent', function (event){
        sidePanelToggle();
    });
    // Show summary
    $scope.$on('summaryPanelEvent', function (event){
        ngDialog.open({
            template:"partials/chat_summary.html",
            scope:$rootScope
          });
    });
    // Show summary
    $scope.$on('scrollNewModule', function (event, moduleRef){
        var options = {
            duration: 700,
            easing: 'easeInQuad',
            offset: 100
        }
        
        var element = document.getElementById(moduleRef);
        smoothScroll(element, options);
    });

    // Actions

    // Jump section
    $scope.jumpSectionClicked = function(){
        //jump to the previous section
        $scope.currentModuleRef--;
        if($scope.currentModuleRef>0){            
            $scope.$emit('scrollNewModule', 'moduleRef_'+$scope.currentModuleRef);
        }else{
            $scope.currentModuleRef=0;
            $scope.$emit('scrollNewModule', 'top');
        }
    };

    // Save clicked
    $scope.saveClicked  = function(){

    };

    // Expand section
    $scope.expandSectionClicked = function(){
        $scope.$emit('summaryPanelEvent');
    };

});
