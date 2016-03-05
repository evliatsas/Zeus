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
                { "Id": 0, "Description": "Κινητό" },
                { "Id": 1, "Description": 'Σταθερό' },
                { "Id": 2, "Description": 'Fax' },
                { "Id": 3, "Description": 'Crypto' }
            ];           
        }
    };
});