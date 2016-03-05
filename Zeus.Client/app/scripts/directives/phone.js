'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('phone', function () {
    return {
        scope: {
            phoneNo: '='
        },
        templateUrl: '/templates/phone.html',
        link: function postLink(scope, element, attrs) {
            scope.phoneTypes = [                
                'Κινητό',
                'Σταθερό',
                'Fax',
                'Crypto'
            ];           
        }
    };
});