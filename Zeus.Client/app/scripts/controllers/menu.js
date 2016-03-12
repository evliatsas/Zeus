'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($scope, $location, authService) {
        $scope.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }

        $scope.isAuth = function () {
            return authService.isAuth();
        }

        $scope.logOut = function () {
            authService.logout();
            $location.url("/login");
        }

        $scope.changePassword = function (password,newPassword,passwordConfirm) {
            authService.changePassword("", password, newPassword, passwordConfirm);
        }
    });
