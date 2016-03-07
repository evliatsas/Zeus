'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($location) {
        this.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }
    });
