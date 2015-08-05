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
    			'<input name="{{name}}" autocomplete="off" placeholder="{{placeHolder}}" ng-disabled="disabled" ng-model="inpModel" ng-trim="false" ng-focus="focus=1" ng-blur="focus=0" type="text">'+
    			'<ng-transclude></ng-transclude>'+
    		'</div>',
      replace:true,
      restrict: 'E',
      transclude:true,
      scope:{
      	inpModel:'=ngModel',
      	disabled:'=ngDisabled',
        placeHolder:'=ngPlaceholder',
      	name:'@',
      	classList:'@class'
      },
      link: function ($scope, element, attrs) {
          // element.attr('placeholder', value);
          $scope.$watch('placeHolder',function(value){
            console.log(value);
          });
          // attrs.$observe('ouinonPlaceholder', function(value) {
          //     element.attr('placeholder', value);
          // });
      }
    };
  });
