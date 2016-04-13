'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ProfileCtrl', function ($scope,sp2Service, sp2Profile, $location) {
    $scope.userData = sp2Service.getLoginData();
    $scope.agencyData = [];

    $scope.agencyView = [[],[]];

    $scope.nav = [
      {name:"ACCOUNT", selected:true},
      {name:"MY SERVICE", selected:false},
      {name:"TRANSACTIONS", selected:false}
    ]

    $scope.disableFilter= true;
   
    // Get a list of all the agencies
  	sp2Profile.profile_getAgencies().then(function(response) {
                $scope.agencies = response.data;
                populateAgencies();
            }, function() {
                console.log("error getting agencies");
            });

     //Create an agency list to populate with categories
    function populateAgencies(){
      sp2Profile.profile_getUserAgencies(sp2Service.getLoginData()._userID).then(function(response) {
                $scope.userAgencies = response.data.agencies;
                //Build the agencyData list 
                for(var i=0; i<$scope.agencies.length; i++){
                  $scope.agencyData[i]=$scope.agencies[i];
                  $scope.agencyData[i].connected =false;
                  $scope.agencyData[i].panelOpen =false;
                  for(var c=0; c<$scope.userAgencies.length; c++){
                    if($scope.agencyData[i].id === $scope.userAgencies[c].id){
                      $scope.agencyData[i].connected =true;
                    }
                  }
                }

                if($scope.agencyData.length > 0) {
                  var len = $scope.agencyData.length;
                  var mid = parseInt(len / 2);

                  $scope.agencyView[0] = $scope.agencyData.slice(0, mid);
                  $scope.agencyView[1] = $scope.agencyData.slice(mid, len);
                }

                populateCategories();
            }, function() {
                console.log("error getting UserAgencies");
            });
    }


    function populateCategories(){
      sp2Profile.profile_getFieldCategories().then(function(response) {
                $scope.fieldCategories = response.data;
                console.log("------------");
                console.log($scope.fieldCategories);
               

                for(var i=0; i<$scope.agencyData.length; i++){
                  $scope.agencyData[i].categories = [];
                  for(var c=0; c<$scope.fieldCategories.length; c++){
                    $scope.agencyData[i].categories[c]=JSON.parse(JSON.stringify($scope.fieldCategories[c]));
                    $scope.agencyData[i].categories[c].enabled = false;
                    //loop to set to false
                    for(var d=0; d< $scope.agencyData[i].categories[c].fields.length ;d++){
                      $scope.agencyData[i].categories[c].fields[d].enabled=false;
                    }
                  }
                }
                getSelectedCategories();

            }, function() {
                console.log("error getting fieldCategories");
            });
    }

    function getSelectedCategories(){
      sp2Profile.profile_getAllowedAgencyFields(sp2Service.getLoginData()._userID).then(function(response) {
                $scope.allowedAgencyFields = response.data;

                var agencyId = 0;
                var categoryId = 0;
                var fieldId = 0;
                var totalFields = 0;
                var totalFieldsSelected = 0;

                for(var i =0; i< $scope.agencyData.length; i++){
                  agencyId = $scope.agencyData[i].id;
                  for(var c =0; c<$scope.agencyData[i].categories.length;c++){
                      categoryId = $scope.agencyData[i].categories[c].id;
                      totalFields = $scope.agencyData[i].categories[c].fields.length
                      totalFieldsSelected = 0;
                      for(var d=0; d< totalFields;d++){
                          fieldId = $scope.agencyData[i].categories[c].fields[d].id
                          for(var e=0; e<$scope.allowedAgencyFields.length; e++){
                            if($scope.allowedAgencyFields[e].agency_id === agencyId && $scope.allowedAgencyFields[e].field_id === fieldId){
                              $scope.agencyData[i].categories[c].fields[d].enabled = true;
                            }
                          }
                          //check if all are selected
                          console.log($scope.agencyData[i].name);
                          if($scope.agencyData[i].categories[c].fields[d].enabled){
                            totalFieldsSelected++;
                          }
                      }
                      //Enable category if all fields are enabled
                      if(totalFieldsSelected === totalFields && totalFields!=0){
                        $scope.agencyData[i].categories[c].enabled=true;
                      }
                  }
                }

                console.log($scope.agencyData);

            }, function() {
                console.log("error getting allowedAgencyFields");
            });
    }

    $scope.toggleCategoryClicked = function(agency, category){
      if(category.enabled){
        category.enabled = false;
        var fieldId = "";
        for(var i=0;i<category.fields.length;i++){
          fieldId=category.fields[i].id;
          category.fields[i].enabled = false;
          sp2Profile.profile_removeUserAgencyField(sp2Service.getLoginData()._userID, agency.id,fieldId).then(function(response) {
            }, function() {
                console.log("error getting removeUserAgencyField");
            });
        }
      }else{
        category.enabled = true;
        var fieldId = "";
        for(var i=0;i<category.fields.length;i++){
          fieldId=category.fields[i].id;
          category.fields[i].enabled = true;
          sp2Profile.profile_addUserAgencyField(sp2Service.getLoginData()._userID,agency.id,fieldId).then(function(response) {
            }, function() {
                console.log("error getting addUserAgencyField");
            });
        }
      }
    }

    
    /*
    //Get a list of all the fields
    sp2Profile.profile_getFields().then(function(response) {
                $scope.fields = response.data;
            }, function() {
                console.log("error getting fields");
            });*/

  	//
  	/*sp2Profile.profile_updateUserAgencies(sp2Service.getLoginData()._userID, [1]).then(function(response) {
                
            }, function() {
                console.log("error getting updateUserAgencies");
            });*/

  	

    //Click Events
    $scope.connectToAgencyClicked = function($event, item, list){
      $event.stopPropagation();
      //send all enabled agencies to update
      item.connected = !item.connected;

      var agencyIdArr = [];

      for(var i=0;i<list.length;i++){
        if(list[i].connected){          
          agencyIdArr.push(list[i].id);
        }
      }
      
      sp2Profile.profile_updateUserAgencies(sp2Service.getLoginData()._userID, agencyIdArr).then(function(response) {
                console.log(response);
            }, function() {
                console.log("error getting updateUserAgencies");
            });
    }


    $scope.filterServicesClicked = function(disableFilter){
      $scope.disableFilter= disableFilter;
      console.log($scope.disableFilter);
    }

    $scope.tabClicked = function(tabId){
      
      console.log("tabClicked " +tabId);
    }

    $scope.openPanel = function(item){
      item.panelOpen =!item.panelOpen;
    }

  	$scope.dashboardClicked = function(){
  		$location.path("/dashboard");
  	}

  });
