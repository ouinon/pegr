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
};

angular.module('pegsApp',['ngCookies','ngResource','ui.bootstrap.buttons'])
.config(['$locationProvider',
	function($locationProvider){
	    $locationProvider.html5Mode(true);
	}
]).value('pegValues',pegValues);