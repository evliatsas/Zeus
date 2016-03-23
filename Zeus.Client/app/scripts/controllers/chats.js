'use strict';

angular
    .module('zeusclientApp')
    .controller('ChatsCtrl', function($scope, $http, $location, $rootScope, authService, messageService, localStorageService, ChatHub) {

    	$scope.users = ChatHub.users;

    	$scope.messages = ChatHub.messages;

        $scope.send = function() {
            // if (usernames) {
            //     for (i in usernames) {
            //         ChatHub.send($scope.newmessage, usernames[i]);
            //     }
            // } else {
            // 	ChatHub.send($scope.newmessage);
            // }
            ChatHub.send($scope.newmessage);
            $scope.newmessage = "";
        };

        ChatHub.observe(connected);

        function connected() {

            ChatHub.getConnectedUsers().done(function(users) {
                $.each(users, function(i, user) {
                    ChatHub.connected.push({ username: user.UserName, fullname: user.FullName });
                    $rootScope.$apply();
                });
            });

            ChatHub.getUsers().done(function(users) {
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