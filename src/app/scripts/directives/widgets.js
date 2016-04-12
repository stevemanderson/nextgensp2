angular.module('nextgensp2').directive('widgetItem', function ($compile) {
    var alertTemplate = '<div class="padding-wrapper"><div class="content"><span class="title" ng-bind-html="content.Data.Title"></span><span class="sub-title" ng-bind-html="content.Data.SubTitle"></span></div><div class="icon"><img src="images/widget-alert.svg"></div></div>';

    var serviceTemplate = '<div class="padding-wrapper"><div class="icon"><img src="images/alert.png"></div><div class="content"><span class="sub-title" ng-bind-html="content.Data.SubTitle"></span><span class="title" ng-bind-html="content.Data.Title"></span></div></div>';

    var getTemplate = function(contentType) {
        var template = '';
        console.log("contentType > "+contentType);
        switch(contentType) {
            case 'Alert':
                template = alertTemplate;
                break;
            case 'Service':
                template = serviceTemplate;
                break;
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        element.html(getTemplate(scope.content.WidgetType)).show();
        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,

        scope: {
            content:'='
        }
    };
});