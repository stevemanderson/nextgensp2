'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextgensp5
 */
angular.module('nextgensp2')
  .controller('DashboardCtrl', function ($scope, $stomp, $log) {

  	$scope.widgetData = [];
    $scope.stompMsgCount = 0;
    $scope.stompdata = {};



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
          'headers': 'are awesome'
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
      console.log(msgData);
      for(var i =0; i<msgData.length;i++){
        $scope.widgetData.unshift(msgData[i]);
      }
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


    function outputSTOMP(data){
    	$scope.stompMsgCount++;
    	$log.debug(data);
    	$scope.stompdata = data;
    	$scope.$apply();
    }

});