'use strict';

/**
 * @ngdoc directive
 * @name nextgensp2.directive:chatfreetext
 * @description
 * # chatfreetext
 */
angular.module('nextgensp2')
  .directive('chatfreetext', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/chat_free_text.html",
    controller: "ChatFreeTextCtrl",
    };
  });

 /**
 * @ngdoc directive
 * @name nextgensp2.directive:chatlocation
 * @description
 * # chatlocation
 */
angular.module('nextgensp2')
  .directive('chatlocation', function () {
    return {
		restrict: 'E',
		replace: true,
    templateUrl: "partials/chat_location.html",
		controller: "ChatLocationCtrl",
    scope:{},
    };
  });
/**
 * @ngdoc directive
 * @name nextgensp2.directive:chatmultiplechoice
 * @description
 * # chatmultiplechoice
 */
angular.module('nextgensp2')
  .directive('chatmultiplechoice', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/chat_multiple_choice.html",
    controller: "ChatMultipleChoiceCtrl",
    scope:{},
    };
  });

angular.module('nextgensp2')
  .directive('chatoptions', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/chat_options.html",
    controller: "ChatOptionsCtrl",
    scope:{},
    };
  });
/**
 * @ngdoc directive
 * @name nextgensp2.directive:chatresources
 * @description
 * # chatresources
 */
angular.module('nextgensp2')
  .directive('chatresources', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/chat_resources.html",
    controller: "ChatResourcesCtrl",
    };
  });
/**
 * @ngdoc directive
 * @name nextgensp2.directive:chatsinglechoice
 * @description
 * # chatsinglechoice
 */
angular.module('nextgensp2')
  .directive('chatsinglechoice', function () {
    return {
      link: function(scope, element) {
        scope.$on('chatModuleEvents', function(event, id, value) {
          element.nextAll('.chat-module').remove();
        });
      },
    restrict: 'E',
    replace: true,
    templateUrl: "partials/chat_single_choice.html",
    controller: "ChatSingleChoiceCtrl",
    scope:{},
    };
  });
/**
 * @ngdoc directive
 * @name nextgensp2.directive:loading
 * @description
 * # loading
 */
angular.module('nextgensp2')
  .directive('loading', function () {
    return {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/chat_loading.html",
    controller: "ChatLoadingCtrl",
    };
  });
  /**
 * @ngdoc directive
 * @name nextgensp2.directive:chatsummary
 * @description
 * # chatsummary
 */
angular.module('nextgensp2')
  .directive('chatsummary', function () {
    return {
    restrict: 'E',
    replace: true,
    templateUrl: "partials/chat_summary.html",
    controller: "ChatSummaryCtrl",
    };
  });
