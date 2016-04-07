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

  	var responseData = {};
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
        var subscription = $stomp.subscribe('/topic/user', function (payload, headers, res) {
          
          outputSTOMP(payload);
        }, {
          'headers': 'are awesome'
        })

        // Unsubscribe
        //subscription.unsubscribe()

        // Send message
        $stomp.send('/topic/user', {
          message: 'body'
        }, {
          priority: 9,
          custom: 42 // Custom Headers
        })

        // Disconnect
        /*$stomp.disconnect(function () {
          $log.info('disconnected')
        })*/
    })

    function outputSTOMP(data){
    	$scope.stompMsgCount++;
    	$log.debug(data);
    	$scope.stompdata = data;
    	$scope.$apply();
    }

});