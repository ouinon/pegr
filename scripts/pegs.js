angular.module("pegsApp",['ngCookies','ngResource','ui.router']).config(
	function($locationProvider,$stateProvider){

	    $stateProvider.state('home', {
			url: "/",
			templateUrl: "templates/home.html",
			controller: function($scope,$cookies,$http,$resource) {

				// $http.defaults.headers.common.AuthSession = $cookies.get('sessionid');

				var Res = $resource('http://local.pegs.website/other/_all_docs',{},{
				        sendcookie: {
				            method: 'GET'
				        }
				});

				var $yo = Res.sendcookie(null,function(){
					console.log('result');
				});

	            // $yo.$save(function(){});

				$scope.items = ["A", "List", "Of", "Items"];
			}
	    });

	    $locationProvider.html5Mode(true);

	}
);

angular.module("pegsApp").factory('notify',['$resource', function($resource) {
   
	$resource('https://ouinon.cloudant.com/pegger/');

 }]);
