'use strict';
/**
 * @ngdoc directive
 * @name affixalllApp.directive:wrapInput
 * @description
 * # wrapInput
 */
angular.module('pegsApp')
  .directive('oInput', function () {
    return {
      template:
    		'<div class="o-input" class="{{classList}}" ng-class="{\'focus\':focus}">'+
    			'<input name="{{name}}" ng-disabled="disabled" ng-model="inpModel" ng-trim="false" ng-focus="focus=1" ng-blur="focus=0" type="text" placeholder="{{placeholder}}">'+
    			'<ng-transclude></ng-transclude>'+
    		'</div>',
      replace:true,
      restrict: 'E',
      transclude:true,
      scope:{
      	inpModel:'=ngModel',
      	disabled:'=ngDisabled',
        placeholder:'@',
      	name:'@',
      	classList:'@class'
      },
      link:function(scope,element){
      	// alert('ho');
      	

      }
    };
  });
