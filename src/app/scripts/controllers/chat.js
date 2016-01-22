'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ChatCtrl', function ($scope, appService, $compile, NgMap, $window) {
    $scope.inputText = "";
    $scope.inputAddress = "";
    var userID = appService.getUserID();
    var userData = {};
    var serviceData = {};
    var responseData = {};
    
    $scope.dashboard = true;

    $scope.serviceColors= ["#a0cef2","#7edd94","#f69b81","#a090ff","#848ba0","#a0cef2","#7edd94","#f69b81","#a090ff","#848ba0"];
    $scope.pinColors= ["#a090ff","#848ba0","#a090ff","#848ba0","#a090ff","#848ba0","#a090ff","#848ba0",];
    var placewording = ["is one place","are two places","are three places","are four places", "are five places", "are six places"];
    $scope.servicePopup = {
        "show":false,
        "title": "",
        "content": "",
        "color":""
    };



    $scope.locationData = {
        "addressShow":true,
        "geoLocateShow":false,
        "selectedLocation":{
            "suburb":"Caboolture",
            "postcode":4510,
            "lat":-27.0651684,
            "long":152.8987155
        }
    };

    $scope.map = {"markers":[
    {
        "lat": -27.0651684,
        "long": 152.8987155,
        "name": "Caboolture Service Centre"
    },
    {
        "lat": -27.084102,
        "long": 152.9514,
        "name": "Caboolture Service Centre"
    }
    ]};

    $scope.availableServices = {};
    $scope.availableServices.services = [];
    $scope.selectedServiceLocations = [];
    var selectedServiceLocationIndex = 0;

    var mouseMove = 0;

    //input
    $scope.checkSubmit = function(e) {
    	if(e.keyCode === 13){
    		//console.log(e.currentTarget.getAttribute('id'));
            switch(e.currentTarget.getAttribute('id')){
                case 'userInput':
                    enterChat();
                break;
                case 'inputAddress':
                    $scope.inputAddress = $scope.locationData.selectedLocation.suburb;
                    addMap();
                break;
            }
            
    	}
    };

 	//Init Chat
    function enterChat(){    	
        //Get the data
    	userData = appService.getUserData();
        serviceData = appService.getServicesData();
    	responseData = appService.getResponseData();
        appService.getUserAge();
        resetChat();
        

        //add thinking
        var fn = partial(keywordSearch,serviceData); 
        addThinking(fn);        
    }

    function keywordSearch(array){
        var currentUserProfile = userData[userID];
        //console.log(currentUserProfile);
        var colorCounter = 0;
    	// look for keyword in available services
    	for(var i =0;i< array.length;i++){
    		
    		for(var c =0;c< array[i].lifeEvent.length;c++){
    			if($scope.inputText.toLowerCase() === array[i].lifeEvent[c].description.toLowerCase()){
    				//console.log("match Service> id="+ array[i].id + " - service="+ array[i].serviceTitle);
    				
    				//Check for any special criteria against user profile
    				var  passedCriteria = true;
                    //Check age
    				if(array[i].specialCriteria.eligibility.ageMax !== 0 && array[i].specialCriteria.eligibility.ageMin !==0 && currentUserProfile.dob !=="" ){
                        if((appService.getUserAge() < array[i].specialCriteria.eligibility.ageMax && appService.getUserAge() >= array[i].specialCriteria.eligibility.ageMin) === false ){
                            //console.log("failed age criteria");
                            passedCriteria = false;
        				}
                    }

    				//Check locations
                    //Check both arrays for values
                    /*
                    if(currentUserProfile.location.length >0 || array[i].specialCriteria.availableLocation.length >0){
                        //Check the service lat and long != 0
                        if(array[i].specialCriteria.availableLocation[0].lat !== 0 && array[i].specialCriteria.availableLocation[0].long !==0) {
                            for(var e =0; e<array[i].specialCriteria.availableLocation.length; e++){
                                //debug
                                console.log("Distance >"+appService.getWithinServiceRadius(
                                    array[i].specialCriteria.availableLocation[e].lat,
                                    array[i].specialCriteria.availableLocation[e].long,
                                    currentUserProfile.location[0].lat,
                                    currentUserProfile.location[0].long
                                    ));
                                console.log("Service radiusKm >"+array[i].specialCriteria.availableLocation[e].radiusKm);
                                //
                                if(appService.getWithinServiceRadius(
                                    array[i].specialCriteria.availableLocation[e].lat,
                                    array[i].specialCriteria.availableLocation[e].long,
                                    currentUserProfile.location[0].lat,
                                    currentUserProfile.location[0].long
                                    ) > array[i].specialCriteria.availableLocation[e].radiusKm){
                                    passedCriteria = false;
                                }
                            }
                        }
                    }*/

    				//Check conditions
                    //console.log(passedCriteria);
                    if(passedCriteria){
                        $scope.availableServices.services.push({ "triggerId": array[i].lifeEvent[c].triggerId,
                                                        "clientFacingTitle": array[i].lifeEvent[c].clientFacingTitle,
                                                        "description": array[i].lifeEvent[c].description,
                                                        "serviceId": array[i].id,
                                                        "serviceInfo": array[i].description,
                                                        "selected": false,
                                                        "color": {"background-color":$scope.serviceColors[colorCounter]}
                                                        });
                        colorCounter++;
                    }
    			}
    			
    		}
    	}
        queResponse('services');
    }

    //Que responses
    function queResponse(msg,data){
        switch (msg){
            case 'services':
            //console.log($scope.availableServices.services.length );
                if($scope.availableServices.services.length >0){
                    addResponse(responseData[msg].screenPositive);
                    addSlider();
                    
                    //hide the dash if on mobile
                    angular.element('.scroll-frame').css({"height":"580px"});
                    if(window.innerWidth < 768){
                        
                        $scope.dashboard = false;
                    }

                }else{
                    addResponse(responseData[msg].screenError);

                }
                break;
            case 'servicessSelected':
                if(appService.getServiceIndex($scope.availableServices.selectedService) !== -1){
                    addResponse(responseData[msg].screenPositive);
                    addLocationBox();
                }else{
                    addResponse(responseData[msg].screenError);
                }
                break;
            case 'mappedServices':
                addResponse(responseData[msg].screenPositive1+placewording[$scope.selectedServiceLocations.length-1]+responseData[msg].screenPositive2);
                addLocationsSlider();
                break;
            case 'getInTouch':
                addResponse(responseData[msg].screenPositive);
                addContactBox();
                break;
            case 'conclusion':
                if(data==="not-safe"){
                    addResponse(responseData[msg].nocontact);
                }else{
                    addResponse(responseData[msg].screenPositive1+$scope.selectedServiceLocations[selectedServiceLocationIndex].name+responseData[msg].screenPositive2+data+responseData[msg].screenPositive3);
                }
                break;
        }
    }

    function resetChat(){
        angular.element('.chat-block').remove();
        $scope.availableServices.services = [];
    }

    // Show thinking
    function addThinking(fn){
        angular.element(document.getElementById('chat-frame')).append('<div class="chat-think"><img class="center-block" src="images/chat-think.svg"></div>');
        window.setTimeout(function(){
            angular.element(document.getElementsByClassName('chat-think')).remove();
            fn();
        }, 1500);
    }

    function addResponse(msg){
        angular.element(document.getElementById('chat-frame')).append('<div class="chat-block"><div class="chat-bubble">'+msg+'</div></div>');
    }

    //Show slider options
    function addSlider(data){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block slider-width"><slider></slider></div>')($scope));
        setTimeout(function(){
            angular.element("slick").removeClass("invisible");
        },300);
    }

    //Map functions
    function addLocationBox(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><locationbox></locationbox></div>')($scope)); 
    }
    function addMap(){
        
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><mapmodule></mapmodule></div>')($scope)); 
        sortMapMarkers();
        //add thinking
        var fn = partial(queResponse,'mappedServices'); 
        addThinking(fn);
    }
    //Add locations slider
    function addLocationsSlider(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block slider-width"><locationslider></locationslider></div>')($scope)); 
        setTimeout(function(){
            angular.element("slick").removeClass("invisible");
        },300);
    }
    
    //Add contactbox
    function addContactBox(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><contactbox></contactbox></div>')($scope)); 
    }

    function sortMapMarkers(){
        $scope.map.markers = $scope.selectedServiceLocations
        //add markers using the Standard gmaps api - ngmap directive markers disappeared?
        NgMap.getMap().then(function(map) {          
            var markers = [];
            for (var i=0; i<$scope.selectedServiceLocations.length ; i++) {
              markers[i] = new google.maps.Marker({
                title: $scope.selectedServiceLocations[i].name,
                icon: "/images/pin"+i+".png"
              })
              var latlng = new google.maps.LatLng($scope.selectedServiceLocations[i].lat, $scope.selectedServiceLocations[i].long);
              markers[i].setPosition(latlng);
              markers[i].setMap($scope.map)
            }
        });
    }

    function partial(func /*, 0..n args */) {
      var args = Array.prototype.slice.call(arguments).splice(1);
      return function() {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
      };
    }

    $scope.sliderClick = function(serviceId){
        if(mouseMove <10){
            $scope.availableServices.selectedService = serviceId;
            for(var i=0;i<$scope.availableServices.services.length; i++){
                if(serviceId === $scope.availableServices.services[i].serviceId){
                    $scope.availableServices.services[i].selected = true;
                }else{
                    $scope.availableServices.services[i].selected = false;
                }
            }
            //Set selected service data
            var selectedService = appService.getServiceIndex($scope.availableServices.selectedService);
            $scope.selectedServiceLocations = serviceData[selectedService].serviceLocation;
             //add thinking
            var fn = partial(queResponse,'servicessSelected'); 
            addThinking(fn);
        }
    };
    $scope.sliderMouseDown = function (event){
        mouseMove=0;
    };
    $scope.slideMouseMove = function (event){
        mouseMove++;
    };

    
    $scope.locationSliderClick = function(index){
        if(mouseMove <10){
            for(var i=0;i<$scope.selectedServiceLocations.length; i++){
                if(i===index){
                    $scope.selectedServiceLocations[i].selected = true;
                }else{
                    $scope.selectedServiceLocations[i].selected = false;
                }
            }
            selectedServiceLocationIndex = index;
            var fn = partial(queResponse,'getInTouch'); 
            addThinking(fn);
        }
    };

    $scope.contactClicked = function(event,btnAction){
        angular.element(event.currentTarget).addClass('active');
        var fn = partial(queResponse,'conclusion',btnAction); 
        addThinking(fn);
        
    };

    $scope.serviceInfo = function(event,title,info,color){
        $scope.servicePopup.title = title;
        $scope.servicePopup.content = info;
        $scope.servicePopup.color = color;
        $scope.servicePopup.show = true;
        event.stopPropagation();
    };

    $scope.getGeoLocation = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.locationData.selectedLocation.lat = $scope.locationData.selectedLocation.lat; //position.coords.latitude;
          $scope.locationData.selectedLocation.long = $scope.locationData.selectedLocation.long; //position.coords.longitude;
          addMap();
        });
    };

    $scope.dashClicked = function(){
        angular.element('.scroll-frame').css({"height":"380px"});
        $scope.dashboard = true;
    }


    
});

