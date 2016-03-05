'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('providerCard', function () {
    return {
        scope: {
            provider: '='
        },
        templateUrl: '/templates/provider-card.html'
    };
});