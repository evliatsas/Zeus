'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('contactCard', function () {
    return {
        scope: {
            contact: '='
        },
        templateUrl: '/templates/contact-card.html'
    };
});