'use strict';

angular
    .module('zeusclientApp')
    .controller('ChatsCtrl', function($scope, $http, $location, authService, messageService, localStorageService, chat) {

        $scope.users = chat.users;
        $scope.messages = chat.messages;
        $scope.send = function() {
        	chat.send($scope.newmessage);
        }
    });