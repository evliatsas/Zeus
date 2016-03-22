'use strict';

angular
    .module('zeusclientApp')
    .factory('chat', ['$rootScope', 'Hub', 'baseUrl', function($rootScope, Hub, baseUrl) {

        var ChatHub = this;
        ChatHub.connected = [];
        ChatHub.messages = [];
        ChatHub.users = [];

        var hub = new Hub('chatHub', {
            autoConnect: false,
            rootPath: baseUrl + '/signalr',
            listeners: {
                'userConnected': function(username, fullname) {
                    ChatHub.connected.push({ username: username, fullname: fullname });
                    $rootScope.$apply();
                },
                'userDisconnected': function(username) {
                    ChatHub.connected.splice(ChatHub.connected.indexOf(username), 1);
                    $rootScope.$apply();
                },
                'received': function(message) {
                    ChatHub.messages.push(message);
                    $rootScope.$apply();
                }
            },
            methods: ['getConnectedUsers','getUnreadCount','getMessages','getArchives','getUsers','send'],
            errorHandler: function(error) {
                console.error(error);
            },
            stateChanged: function(state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.connected:
                        ChatHub.connected.splice(0, ChatHub.connected.length);
                        $rootScope.$apply();
                        hub.getConnectedUsers().done(function(users) {
                            $.each(users, function(i, user) {
                                ChatHub.connected.push({ username: user.UserName, fullname: user.FullName });
                                $rootScope.$apply();
                            });
                        });
                        hub.getUsers().done(function(users) {
                            $.each(users, function(i, user) {
                                ChatHub.users.push(user);
                                $rootScope.$apply();
                            });
                        });
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.disconnected:
                        //your code here
                        break;
                }
            }
        });

        ChatHub.connect = hub.connect;
        ChatHub.disconnect = hub.disconnect;
        ChatHub.getConnectedUsers = hub.getConnectedUsers;
        ChatHub.getUnreadCount = hub.getUnreadCount;
        ChatHub.getMessages = hub.getMessages;
        ChatHub.getArchives = hub.getArchives;
        ChatHub.getUsers = hub.getUsers;
        ChatHub.send = hub.send;
        ChatHub.setToken = function(token) {
            hub.connection.qs = {'access_token': token };
        }
        return ChatHub;
    }]);