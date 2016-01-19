'use strict';

/**
 * @ngdoc service
 * @name sprintOneApp.loginservice
 * @description
 * # loginservice
 * Service in the sprintOneApp.
 */
angular.module('sprintOneApp')
  .service('loginservice', function () {
  	var _loginData ={};
  	var _hasServices = false;
  	var _dataSharingOn = true;

  	var _serviceData= {
    	"services":[
	    	{
	    		"name":"Family Planning",
	    		"department":"Health",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Lifeline",
	    		"department":"Crisis Support",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Triple P",
	    		"department":"Family",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Airbnb",
	    		"department":"Accomodation",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Medicare",
	    		"department":"Health",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Beyond Blue",
	    		"department":"Health",
	    		"selected":false,
	    		"shareInfo":false
	    	},{
	    		"name":"Get Set For Work",
	    		"department":"Education",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"TAFE",
	    		"department":"Education",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Youth Allowance",
	    		"department":"Human Services",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"QTAC",
	    		"department":"Education",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"Uber",
	    		"department":"Transport",
	    		"selected":false,
	    		"shareInfo":false
	    	},
	    	{
	    		"name":"myFuture",
	    		"department":"Education",
	    		"selected":false,
	    		"shareInfo":false
	    	}
    	]
    };
  	
    return {
        getHasServices: function () {
          return _hasServices;                  
        },
        getServiceData: function () {
          return _serviceData;                  
        },
        getDataSharingOn: function () {
          return _dataSharingOn;                  
        },
        setDataSharingOn: function (flag) {
          _dataSharingOn = flag;                  
        },

    };
  });
