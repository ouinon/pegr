angular.module('pegsApp').controller('HomeCtrl',
	['pegValues','$scope','$cookies','$http','$resource','$sce','$window',function(pegValues,$scope,$cookies,$http,$resource,$sce,$window) {

	// private functions

	var resultToHTML = function(Arr){
		return Arr.map(function(item){
			if(!item){
				return '<span><span></span></span>';
			}
			return '<span class="value"><span class="square"><span class="int">'+item+'</span></span></span>';
		}).join('');
	};

	var convert = function(string){

		var result = {
			val:'',
			input:string.toLowerCase(),
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

				if(!result.val.length){
					result.error = 'String is not a peg';
				}
				else if(!parseInt(result.val[0])){
					result.error = '0 Padding is not allowed';
				}

				return result;
			}
			return resultToObj(newletter);
		};
		return resultToObj(string);
	};

	// $scope functions

	$scope.$watch('inputPeg',function(input){
		var pegsAr = [];
		var inputAr = [];
		var colsAr = [];
		var html = '';
		var delimitRg = /[^\dA-Za-z-]+/g;
		var delimitSingleRg = /[^\dA-Za-z-]{1}/;
		// Regex is slightly different in this instacence to catch only the first character
		var delimitMatches;
		var delimit = input ? input.match(delimitSingleRg) : '';

		if(delimit){
			inputAr = input.replace(delimitRg,delimit[0]).split(delimit[0]);
			delimitMatches = input.match(delimitRg);
		}else{
			inputAr = [input];
		}
		if(input){
			var added = [];
			inputAr.map(function(inputval,index){

				var result = convert(inputval.toLowerCase());
				colsAr = colsAr.concat(result.cols);

				if(added.indexOf(result.input) === -1){
					pegsAr.push(result);
					added.push(result.input);
				}

				if(delimitMatches && delimitMatches[index]){
					var delimitConcat = delimitMatches[index].replace(/.{1}/g,' ').split(' ');
					// Remove the last element, it's always one longer than it needs to be.
					delimitConcat.pop();
					// Ensure that spaces on the end of the string don't add extra elements
					// #FAIRE - There must be an easier way to write this.
					if(delimitMatches.length===++index && input.substr(-1).match(delimitSingleRg)){
						delimitConcat.pop();
					};
					colsAr = colsAr.concat(delimitConcat);
				}

			});
			if(input.length < 50){
				html = $sce.trustAsHtml(resultToHTML(colsAr));
			}
		}

		$scope.inputHTML = html;
		$scope.pegsNew = pegsAr;

	});

	$scope.getKeys = function(){
		return Object.keys($scope.pegs);
	};

	$scope.savePegs = function(){

		var added = [];

		$scope.pegsNew.forEach(function(peg){

			var pegAr = $scope.pegs[peg.val];

			if(pegAr){
				console.log(peg.input,pegAr.indexOf(peg.input));
			}

			if(!peg.error){
				if(!pegAr){
					$scope.pegs[peg.val] = [peg.input];	
				}else if(pegAr.indexOf(peg.input) === -1){
					$scope.pegs[peg.val].unshift(peg.input);
				}
			}

		});

		user.pegs = $scope.pegs;

		user.$update(function(res){
			user._rev = res.rev;
		});

	};

	$scope.pegs = {};
	$scope.pegsNew = [];
	$scope.rowlayout = false;
	$scope.inputHTML;
	$scope.userId;

	var user;
	var Res = $resource('http://local.pegs.website/other/:id',{'id':'@id'},{
		update: {
			method: 'PUT'
		}
	});

	(function init(id,name){
		if(id){
			$scope.userId = id;
			Res.get({id:$scope.userId},
				function(result){

					user = result;
					$scope.pegs = user.pegs;

				},
				function(result){

					user = new Res({'_id':$scope.userId});
					user.pegs = {};
					user.username = name;

					user.$save(function(res){
						user._rev = res.rev;
					},function(error){
						if(error.status && error.status === 401){
							$window.location.href = 'http://local.pegs.website/node/auth/google/';
						}
					});

				}
			);
		}
	})($cookies.get('UserId'),$cookies.get('Name'));

}]);