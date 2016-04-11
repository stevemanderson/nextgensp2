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
    $scope.agencyData = [];
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

    $scope.toggleCategoryClicked = function(agencyId,categoryId, indexsArr){
      //find current state
      console.log("userID"+sp2Service.getLoginData()._userID);

      var agencyIndex = indexsArr[0];
      var categoryIndex = indexsArr[1];
      console.log($scope.agencyData[agencyIndex].name);
      console.log($scope.agencyData[agencyIndex].categories[categoryIndex].name);


      if($scope.agencyData[agencyIndex].categories[categoryIndex].enabled){
        $scope.agencyData[agencyIndex].categories[categoryIndex].enabled = false;
        var fieldId = "";
        //Turn off all fields in category
        console.log("Categories off " +$scope.agencyData[agencyIndex].name +$scope.agencyData[agencyIndex].categories[categoryIndex].name);
        for(var i=0;i<$scope.agencyData[agencyIndex].categories[categoryIndex].fields.length;i++){
          fieldId=$scope.agencyData[agencyIndex].categories[categoryIndex].fields[i].id;
          //Should be set after call back
          $scope.agencyData[agencyIndex].categories[categoryIndex].fields[i].enabled = false;
          sp2Profile.profile_removeUserAgencyField(sp2Service.getLoginData()._userID,agencyId,fieldId).then(function(response) {
                
            }, function() {
                console.log("error getting removeUserAgencyField");
            });
        }
      }else{
        $scope.agencyData[agencyIndex].categories[categoryIndex].enabled = true;

        var fieldId = "";
        //Turn on all fields in category
        console.log("Categories on " +$scope.agencyData[agencyIndex].name +$scope.agencyData[agencyIndex].categories[categoryIndex].name);
        for(var i=0;i<$scope.agencyData[agencyIndex].categories[categoryIndex].fields.length;i++){
          fieldId=$scope.agencyData[agencyIndex].categories[categoryIndex].fields[i].id;
          $scope.agencyData[agencyIndex].categories[categoryIndex].fields[i].enabled = true;
          sp2Profile.profile_addUserAgencyField(sp2Service.getLoginData()._userID,agencyId,fieldId).then(function(response) {
                
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
    $scope.connectToAgencyClicked = function($event,index){
      $event.stopPropagation();
      console.log("connectToAgencyClicked"+index);
      //send all enabled agencies to update
      $scope.agencyData[index].connected = !$scope.agencyData[index].connected;

      var agencyIdArr = [];

      for(var i=0;i<$scope.agencyData.length;i++){
        console.log($scope.agencyData[i].connected);
        if($scope.agencyData[i].connected){          
          agencyIdArr.push($scope.agencyData[i].id);
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

    $scope.openPanel = function(index){
      $scope.agencyData[index].panelOpen =!$scope.agencyData[index].panelOpen;
    }

  	$scope.dashboardClicked = function(){
  		$location.path("/dashboard");
  	}

  });
