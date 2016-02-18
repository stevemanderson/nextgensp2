'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('Sprint2Ctrl', function ($scope, sp2Service,  $compile, $rootScope, ngDialog, $location,smoothScroll,$timeout,$sce) {

  	var responseData = {};
    responseData.moduleType = "freeText";

    var current_PID = 0;
    var current_ID = 0;
    var current_answer = 0;
    $scope.moduleRef = 0;
    $scope.currentModuleRef = 0;

    $scope.moduleData;
    $scope.sessionStats = {};
    $scope.inputText = "i'm concerned about my family's health";

    $rootScope.businessLocation = "";

    $scope.showCartIcon = true;

    $scope.topbars = {
        serviceAlert:false,
        summary:true
    };
    $scope.enterTxt = false;



    $scope.config = {
                sources: [
                    {src: $sce.trustAsResourceUrl("images/big-buck-bunny.mp4"), type: "video/mp4"}
                ],
                tracks: [
                    {
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }
                ],
                theme: "bower_components/videogular-themes-default/videogular.css",
                plugins: {
                    poster: "images/big-buck-bunny-poster.jpg",
                    controls: {
                        autoHide: true,
                        autoHideTime: 3000
                    }
                }
            };


    $scope.snippet={
        title: "Guide To Talking About Family Violence",
        subtitle: "2 Minute Read",
        content: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>"
    };


    $scope.firstResponse = function(e){
        if(e.keyCode === 13){
            //clear exisiting chat
            angular.element(document.getElementById('chat-frame')).empty();

            addLoader();
            sp2Service.sendToAPIAI($scope.inputText).then(function(response) {
                console.log(response);
                removeLoader();
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
    function sendResponse(pid, id, value){
        var dataVar = {};
        dataVar.pid = pid;
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
    function sendMultiResponse(pid, ids, value){
        var dataVar = {};
        dataVar.pid = pid;
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
            updateStats(response.data);
        }, function() {
        });
    }

    function buildChat(data){

        current_PID = data.id;

        console.log("current_PID",current_PID);
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
            case "boolean":
                type = '<chatbooleanchoice></chatbooleanchoice>';
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
        console.log("updateStats",data);
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
          data: data,
          cost_min:cost_min,
          cost_max:cost_max,
          number_steps:steps
        };
        angular.element(document.getElementsByClassName('number-indicator')).css({transform: 'scale(1)'});
        console.log("number_steps >> ",$rootScope.sessionStats.number_steps);
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
    $scope.$on('chatModuleEvents', function (event, pid, id, value){
        sendResponse(pid, id, value);
    });

    //Capture event from multi choice modules
    $scope.$on('chatMultiModuleEvents', function (event, pid, ids, value){
        sendMultiResponse(pid, ids, value);
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
    // Show summary
    $scope.$on('updateServices', function (event){
        console.log("updateServices");
        angular.element(document.getElementsByClassName('number-indicator')).css({transform: 'scale(0.1)'});
        //Update session services
        getSessionServices();
    });

    $scope.$on('openCallBack', function(event, serviceTitle){
        var data = {serviceTitle:serviceTitle};
        ngDialog.open({
            template:"partials/popup_callback.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-callback',
            controller: 'CallbackCtrl',
            data: data
        });
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
        //$scope.$emit('summaryPanelEvent');
        ngDialog.open({
            template:"partials/popup_sp3_summary.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-summary',
            controller: 'Sp3SummaryCtrl'
        });
    };

    //Test Video
    $scope.testVideoClicked = function(){
        getSessionServices();
    };
    $scope.$on('showVideo', function (event, url){
        console.log("showvideo >", url);
        $scope.config.sources[0] = {src: $sce.trustAsResourceUrl(url), type: "video/mp4"};
        ngDialog.open({
            template:"partials/popup_video.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-video'
        });
    });


    //Test Snippet
    $scope.testSnippetClicked = function(){
        ngDialog.open({
            template:"partials/popup_snippet.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-snippet'
        });
    };

    
    //Test Callback
    $scope.testCallbackClicked = function(){
        ngDialog.open({
            template:"partials/popup_callback.html",
            scope:$scope,
            className: 'ngdialog-theme-default ngdialog-theme-callback',
            controller: 'CallbackCtrl'
        });
    };

});
