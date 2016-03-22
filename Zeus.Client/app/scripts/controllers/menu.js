﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($scope, $location, $http, $translate, baseUrl, authService, chat) {

        $scope.unread = 0;
        $scope.auth = authService.data;
        $scope.chat = chat;

        $scope.getClass = function(path) {
            var i = path.indexOf($location.path());
            if (i == -1) {
                return '';
            } else {
                return 'active';
            }
        }

        $scope.logOut = function() {
            authService.logout();
            $location.url("/login");
        }

        $scope.changePassword = function() {
            authService.changePassword($scope.user,"change");
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

        if (authService.data.isAuth) {
            $http({
                method: 'GET',
                url: baseUrl + '/reports/messages/unread'
            }).then(function successCallback(response) {
                $scope.unread = response.data;
            }, function errorCallback(response) {
                $scope.unread = 0;
            });
        }

    });
