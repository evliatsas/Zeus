'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('facilityHousing', function () {
    return {
        scope: {
            housing: '=',
            index: '='
        },
        templateUrl: '/templates/facility-housing.html',
        link: function postLink(scope, element, attrs) {
            scope.categories = ['ISOBOX', 'Σκηνή', 'Ξενοδοχείο', 'Οικία', 'Ανοικτός Χώρος'];
            scope.statuses = ['Σε Λειτουργία', 'Υπο Επισκευή', 'Υπο Κατασκευή', 'Κατεστραμένο', 'Ανενεργό'];
        }
    };
});