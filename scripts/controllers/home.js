angular.module('pegsApp').controller('HomeCtrl',
	['pegValues','$scope','$cookies','$http','$resource','$sce',function(pegValues,$scope,$cookies,$http,$resource,$sce) {

	var convert = function(string){
		var result = {
			val:'',
			cols:[]
		};
		var resultToObj = function(string){
			var letter = string[0];
			var str = pegValues[letter] ? pegValues[letter] : '';
			var newletter = string.slice(1);
			// If it's the last letter and "0" and the result is empty add it
			// Accept "0" in other words
			if(str){
				result.val += str;
			}
			result.cols.push(str);
			// If it's the last letter return the string itself.
			if(!newletter){
				return result;
			}
			return resultToObj(newletter);
		};
		return resultToObj(string);
	};

	var resultToHTML = function(Arr){
		return Arr.map(function(item){
			if(!item){
				return '<span><span></span></span>';
			}
			return '<span class="value"><span class="square"><span class="int">'+item+'</span></span></span>';
		});
	};

	$scope.$watch('input0',function(input){

		var resultOb = input ? convert(input.toLowerCase()) : null;
		var htmlResultAr;
		var obj;

		if(resultOb){

			htmlResultAr = resultToHTML(resultOb.cols);

			obj = {
				"input":input,
				"value":resultOb.val
			};

			$scope.pegsNew = [];
			$scope.htmlVal = $sce.trustAsHtml(htmlResultAr.join(''));
			$scope.total = resultOb.val;

			if(!parseInt(resultOb.val[0]) && resultOb.val.length > 1){
				obj.error = '0 Paddding is not allowed';
			}
			$scope.pegsNew.push(obj);

		}

	});

	$scope.savePegs = function(){

		// console.log(userId,$cookies.getAll());

		$scope.pegsNew.forEach(function(peg){

			console.log('user',user);

			var pegAr = $scope.pegs[peg.value];

			console.log(pegAr);
			if(pegAr){
				console.log(peg.input,pegAr.indexOf(peg.input));
			}

			if(!pegAr){
				$scope.pegs[peg.value] = [peg.input];	
			}else if(pegAr.indexOf(peg.input) === -1){
				$scope.pegs[peg.value].push(peg.input);
			}

			user.pegs = $scope.pegs;

			user.$update(function(res){
				user._rev = res.rev;
				// user._id = res.id;
				// console.log(res);
			});

		});

	};

	var userId;
	var Res = $resource('http://local.pegs.website/other/:id',{'id':'@id'},{
		update: {
			method: 'PUT'
		}
	});
	var user;
	$scope.pegs = {};

	(function init(id){
		userId = id;
		if(userId){
			Res.get({id:userId},
				function(result){
					user = result;
					console.log(user);
					$scope.pegs = user.pegs;
				},
				function(result){
					// console.log('here');
					user = new Res({'_id':userId});
					user.pegs = {};
					user.$save(function(res){
						user._rev = res.rev;
					});
				}
			);
		}
	})($cookies.get('UserId'));

}]);