'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($scope, $location, $http, $translate, baseUrl, authService, ChatHub) {

        $scope.chat = ChatHub;
        $scope.auth = authService.data;
        
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

    });
