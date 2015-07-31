'use strict';

var pegValues = {
	's':'0',
	'z':'0',
	't':'1',
	'd':'1',
	'n':'2',
	'm':'3',
	'r':'4',
	'l':'5',
	'g':'6',
	'j':'6',
	'k':'7',
	'c':'7',
	'f':'8',
	'v':'8',
	'p':'9',
	'b':'9'
}

angular.module('pegsApp',['ngCookies','ngResource','ui.bootstrap.buttons','ui.router']).config(
	function($locationProvider,$stateProvider){
	    $stateProvider.state('home', {
			url: "/",
			templateUrl: "templates/home.html",
			controller: 'HomeCtrl'
	    });

	    $locationProvider.html5Mode(true);

	}
).value('pegValues',pegValues);

angular.module('pegsApp').factory('notify',['$resource', function($resource) {
   
	$resource('https://ouinon.cloudant.com/pegger/');

 }]);
