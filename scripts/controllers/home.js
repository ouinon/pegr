angular.module('pegsApp').controller('HomeCtrl',
	['pegValues','$scope','$cookies','$http','$resource','$sce','$window','$timeout',
	function(pegValues,$scope,$cookies,$http,$resource,$sce,$window,$timeout) {

	var placeHolderFlash = function(message){
		$scope.placeHolder = message;
		$timeout(function(){
			$scope.placeHolder = placeholderDefault;
		},2000);
	}

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

		if(!input){
			$scope.validPeg = false;
		}else{
			var added = [];
			inputAr.map(function(inputval,index){

				var result = convert(inputval.toLowerCase());
				if(!$scope.validPeg){
					$scope.validPeg = (result.val && !result.error);
				}
				colsAr = colsAr.concat(result.cols);
				// Ensure that the peg isn't added twice to the result
				if(added.indexOf(result.input) === -1){
					pegsAr.push(result);
					added.push(result.input);
				}

				if(delimitMatches && delimitMatches[index]){
					// Get the delimitting characters between words
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

	$scope.logout = function(){
		// /auth/google/logout

		$http.get('/node/auth/google/logout').success(function(data,status){
			placeHolderFlash('You are logged out.');
			$scope.userId = undefined;
			$scope.userName = undefined;
		});
	};

	$scope.savePegs = function(){

		var added = [];
		var intNew = 0;
		var intUpdate = 0;
		var intExist = 0;

		$scope.pegsNew.forEach(function(peg){

			if(!peg.error){
				// If it doesn't yet exist
				if(!$scope.pegs[peg.val]){
					intNew++;
					$scope.pegs[peg.val] = [peg.input];	
				// If it isn't in the array
				}else if($scope.pegs[peg.val].indexOf(peg.input) === -1){
					intNew++;
					$scope.pegs[peg.val].unshift(peg.input);
				// If it is in the array but isn't the first element
				}else if($scope.pegs[peg.val][0] !== peg.input){
					intUpdate++;
					delete $scope.pegs[peg.val][$scope.pegs[peg.val].indexOf(peg.input)];
					$scope.pegs[peg.val].unshift(peg.input);
				// If it is in the array and is the first element
				}else{
					intExist++;
				}

			}

		});


		if($scope.userId){

			if(intNew || intUpdate){

				user.pegs = $scope.pegs;
				var sArr = ['','s'];
				var msgArr = [];
				// Populate the message array
				if(intNew){
					msgArr.push(intNew+' Peg'+sArr[Number(Boolean(intNew-1))]+' Added');
				}
				if(intExist){
					msgArr.push(intExist+' Peg'+sArr[Number(Boolean(intExist-1))]+' Exist');
				}
				if(intUpdate){
					msgArr.push(intUpdate+' Peg'+sArr[Number(Boolean(intUpdate-1))]+' Updated');
				}

				user.id = $scope.userId;
				user.$update(function(res){

					placeHolderFlash(msgArr.join(', '));
					$scope.inputPeg = '';
					user._rev = res.rev;

				});

			}else{
				$scope.inputPeg = '';
				placeHolderFlash('No pegs to add');
			}

		}else{
		
			$scope.inputPeg = '';
			placeHolderFlash('Sign-in to save Pegs!');

		}

	};

	// $scope and variable declarations.
	$scope.pegs = {};
	$scope.pegsNew = [];
	$scope.rowlayout = false;
	$scope.inputHTML;
	$scope.userId;
	$scope.userName;
	$scope.validPeg = false;
	$scope.placeHolder = 'New Pegs Here…';

	var user;
	var placeholderDefault = $scope.placeHolder;
	var Res = $resource('/cloudant/:id',{'id':'@id'},{
		update: {
			method: 'PUT'
		}
	});

	$http.get('/node/auth/google/callback/verify').success(function(data,status){
		if(data.LoggedIn && data.LoggedIn === true){
			if(data.UserId){

				$scope.userId = data.UserId;
				$scope.userName = data.Name;

				Res.get({id:$scope.userId},
					function(result){

						user = result;
						$scope.pegs = user.pegs;

					},
					function(result){

						user = new Res({'_id':$scope.userId});
						user.pegs = {};
						user.username = $scope.userName;

						user.$save(function(res){
							user._rev = res.rev;
						});

					}
				);
			}
		};
	});

}]);