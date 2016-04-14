'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextgensp5
 */
angular.module('nextgensp2')
  .controller('DashboardCtrl', function ($scope, $stomp, $log, sp2Service, sp2Profile, $window,$timeout) {
    $scope.userData = sp2Service.getLoginData();
  	$scope.widgetData = [];
    $scope.stompMsgCount = 0;
    $scope.stompdata = {};
    $scope.agencies =[];


    //Get a list of all agencies
    sp2Profile.profile_getAgencies().then(function(response) {
                $scope.agencies = response.data;
            }, function() {
                console.log("error getting agencies");
            });


    // Subscribe to the users dashboard update channel
    // http://127.0.0.1:15674/stomp

    /*$stomp.setDebug(function (args) {
      $log.debug(args)
    })*/

    $stomp
      .connect('http://localhost:15674/stomp', {login:"test",passcode:"test"} )

      // frame = CONNECTED headers
      .then(function (frame) {
        var subscription = $stomp.subscribe('/exchange/nextgensp2/123456', function (payload, headers, res) {
          processWidgetData(payload);
          outputSTOMP(payload);
        }, {
        })

        // Unsubscribe
        //subscription.unsubscribe()

        // Send message
        /*$stomp.send('/exchange/services', {
          message: 'body'
        }, {
          priority: 9,
          custom: 42, // Custom Headers
          'reply-to':'123456'
        })*/

        // Disconnect
        /*$stomp.disconnect(function () {
          $log.info('disconnected')
        })*/
    })


    //Process the widget data
    function processWidgetData(msgData){
      //$scope.widgetData;
      //Check array and split out individual widgets
      for(var i =0; i<msgData.length;i++){
        msgData[i].processed = false;
        msgData[i].showAction = true;
        msgData[i].loading = false;

        //Check if "Apply"
        var title = msgData[i].Data.Title;
        if(title.indexOf("Apply")>-1){
          msgData[i].Data.ButtonText="Apply";
        }
        $scope.widgetData.unshift(msgData[i]);
      }
    }



    //function return agency name
    $scope.getAgencyName =  function(agencyId){
      name="";
      for(var i=0; i< $scope.agencies.length; i++){
          if(agencyId == $scope.agencies[i].id){
            name = $scope.agencies[i].name;
          }
      }
      return name; 
    }


    //Events

    //Send the search text msg to the queue
    $scope.$on('searchText', function(event, text) {
        $stomp.send('/exchange/services', {
          message: text
        }, {
          priority: 9,
          custom: 42, // Custom Headers
          'reply-to':'123456'
        })
    });

    $scope.widgetActionButtonClicked = function(widgetIndex, url){
      //Check level
      var user = sp2Service.getLoginData();
      if(user._userLevel === 2){
        //Mockup change auto submit

        $scope.widgetData[widgetIndex].showAction = false;
        $scope.widgetData[widgetIndex].loading = true;
        $timeout(function() {
          $scope.widgetData[widgetIndex].processed = true;
          $scope.widgetData[widgetIndex].loading = false;
        }, 3000);
        
      }else{
        // open link in new window
        $window.open(url, '_blank');
      }

    }
    $scope.widgetReadButtonClicked = function(widgetIndex, url){
        // open link in new window
        $window.open(url, '_blank');
     

    }


    function outputSTOMP(data){
    	$scope.stompMsgCount++;
    	$log.debug(data);
    	$scope.stompdata = data;
    	$scope.$apply();
    }

});