 /*jshint unused:false*/
'use strict';

/**
 * @ngdoc service
 * @name nextgensp2.appService
 * @description
 * # appService
 * Service in the nextgensp2.
 */
angular.module('nextgensp2')
  .service('appService', function ($http, $cookies, uuid2) {
    
    var _userSession = {};
    var _userData = {}; 
    var _schemaData ={};
    var _responsesData ={};


  //load User JSON
	$http.get('data/person.json').success(function(data){
		_userData = data.person; 
	});
  //load GOV JSON
  $http.get('data/schema.json').success(function(data){
    _schemaData = data.service;      
  });
  //load Responses JSON
  $http.get('data/responses.json').success(function(data){
    _responsesData = data;      
  });

	return {
        getUserData: function () {
          return _userData;                  
        },
        getServicesData: function () {
          return _schemaData;                  
        },
        getResponseData: function () {
          return _responsesData;                  
        },
        getUserID: function(){
          return _currentUser;
        },
        setUserID: function(id){
          _currentUser = id;
        },
        getUserAge: function(){
          var age = 0;
          if(_userData[_currentUser].dob !==""){
            var dobYear = new Date(_userData[_currentUser].dob);
            age = new Date().getFullYear() - dobYear.getFullYear();
          }
          //console.log(age);
          return age;
        },
        getWithinServiceRadius: function(lat1,lon1,lat2,lon2){
          //console.log(lat1,lon1,lat2,lon2);
          var r = 6371.009; //KM
          lat1 *= Math.PI / 180;
          lon1 *= Math.PI / 180;
          lat2 *= Math.PI / 180;
          lon2 *= Math.PI / 180;
          var lonDelta = lon2 - lon1;
          var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
          var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
          var angle = Math.atan2(Math.sqrt(a) , b);
          return angle * r;
        },
        getServiceIndex: function(serviceId){
          for(var i=0;i<_schemaData.length ;i++){
            if(_schemaData[i].id === serviceId){
                return i;
            }
          }   
          return -1;       
        }

    };

  });
