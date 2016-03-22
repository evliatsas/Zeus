'use strict';

angular
    .module('zeusclientApp')
    .controller('LoginCtrl', function($scope, $http, $location, authService, messageService, localStorageService, chat) {

        $scope.login = function() {
            authService.login({ userName: $scope.username, password: $scope.password }).then(function() {
                chat.createHub();
            });
        }
    });