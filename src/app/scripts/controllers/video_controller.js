'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:VideoCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('VideoCtrl', function ($scope, $sce) {
  	console.log($sce.trustAsResourceUrl("http://0.0.0.0:9000/images/big-buck-bunny.mp4"));
  	$scope.config = {
				sources: [
					{src: $sce.trustAsResourceUrl("images/big-buck-bunny.mp4"), type: "video/mp4"}
				],
				tracks: [
					{
						src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
						kind: "subtitles",
						srclang: "en",
						label: "English",
						default: ""
					}
				],
				theme: "bower_components/videogular-themes-default/videogular.css",
				plugins: {
					poster: "images/big-buck-bunny-poster.jpg"
				}
			}

});
