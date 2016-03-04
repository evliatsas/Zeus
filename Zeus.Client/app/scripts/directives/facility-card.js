'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('facilityCard', function() {
  return {
  	scope: {
  		facility: '='
  	},
    templateUrl: '/templates/facility-card.html'
  };
});