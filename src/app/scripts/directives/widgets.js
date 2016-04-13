angular.module('nextgensp2').directive('widgetItem', function ($compile,$templateRequest) {
    
    var linker = function(scope, element, attrs) {
        var url="";
        
        switch(scope.content.WidgetType) {
            case 'Alert':
                url = "partials/widget-alert.html";
                break;
            case 'Service':
                url = "partials/widget-service.html";
                break;
        }
        $templateRequest(url)
        .then(function(templateContainer) {
            element.html(templateContainer).show();
            $compile(element.contents())(scope);
        })

    }

    return {
        restrict: "E",
        link: linker,

        scope: {
            content:'='
        }
    };
});