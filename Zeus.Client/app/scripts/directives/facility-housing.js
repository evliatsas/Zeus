'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('facilityHousing', function (lookupService) {
    return {
        scope: {
            housing: '=',
            index: '='
        },
        templateUrl: '/templates/facility-housing.html',
        link: function postLink(scope, element, attrs) {
            scope.categories = lookupService.getFacilityCategories();
            scope.statuses = lookupService.getStatus();
        }
    };
});