'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($scope, $location, $http, baseUrl, authService) {

        $scope.isAuth = authService.isAuth();

        $scope.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }

        $scope.logOut = function() {
            authService.logout();
            $location.url("/login");
        }

        $scope.changePassword = function(password, newPassword, passwordConfirm) {
            authService.changePassword("", password, newPassword, passwordConfirm);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/reports/message/unread'
        }).then(function successCallback(response) {
            $scope.unread = response.data;
        }, function errorCallback(response) {
            $scope.unread = 0;
        });
    });
