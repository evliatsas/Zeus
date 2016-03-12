'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($scope, $location, $http, $translate, baseUrl, authService) {

        $scope.unread = 0;
        $scope.isAuth = function() {
            return authService.isAuth();
        }

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

        $scope.language = "EN";
        $scope.languageTitle = "Switch to English";
        $scope.changeLanguage = function() {
            if ($scope.language == "EN") {
                $translate.use('en');
                $scope.language = "ΕΛ";
                $scope.languageTitle = "Αλλαγή σε Ελληνικά";
            } else {
                $translate.use('el');
                $scope.language = "EN";
                $scope.languageTitle = "Switch to English";
            }

        }

        if ($scope.isAuth()) {
            $http({
                method: 'GET',
                url: baseUrl + '/reports/message/unread'
            }).then(function successCallback(response) {
                $scope.unread = response.data;
            }, function errorCallback(response) {
                $scope.unread = 0;
            });
        }
    });
