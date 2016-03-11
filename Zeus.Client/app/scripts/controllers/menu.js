'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($location, authService) {
        this.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }

        this.isAuth = function () {
            return authService.isAuth();
        }

        this.logOut = function () {
            authService.logout();
        }
    });
