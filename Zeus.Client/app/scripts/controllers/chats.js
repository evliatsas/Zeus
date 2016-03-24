'use strict';

angular
    .module('zeusclientApp')
    .controller('ChatsCtrl', function($scope, $http, $location, $rootScope, $timeout, authService, messageService, utilitiesService, localStorageService, ChatHub) {

        $scope.users = ChatHub.users;
        $scope.util = utilitiesService;
        $scope.messages = ChatHub.messages;

        $scope.send = function() {
            // if (usernames) {
            //     for (i in usernames) {
            //         ChatHub.send($scope.newmessage, usernames[i]);
            //     }
            // } else {
            // 	ChatHub.send($scope.newmessage);
            // }
            if ($scope.newmessage == '') {
                return;
            }

            ChatHub.send($scope.newmessage);
            $scope.newmessage = '';

            $timeout(function () {
                var element = document.getElementById("messages");
                element.scrollTop = 100000;
            }, 10);
        };

        ChatHub.observe(connected);

        function connected() {

            ChatHub.getConnectedUsers().done(function(users) {
                ChatHub.connected.splice(0, ChatHub.connected.length);
                $.each(users, function(i, user) {
                    ChatHub.connected.push({ username: user.UserName, fullname: user.FullName });
                    $rootScope.$apply();
                });
            });

            ChatHub.getUsers().done(function(users) {
                ChatHub.users.splice(0, ChatHub.users.length);
                $.each(users, function(i, user) {
                    ChatHub.users.push(user);
                    $rootScope.$apply();
                });
            });

            ChatHub.getMessages().done(function(messages) {
            	ChatHub.messages.splice(0, ChatHub.messages.length);
                $.each(messages, function(i, msg) {
                    ChatHub.messages.push(msg);
                    $rootScope.$apply();
                });
            });
        }

        if (ChatHub.isConnected) {
            connected();
        }

    });