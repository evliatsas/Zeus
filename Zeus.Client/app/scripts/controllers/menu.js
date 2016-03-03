'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
    .controller('MenuCtrl', function($location) {
        this.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }
    });
