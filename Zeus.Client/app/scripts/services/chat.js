'use strict';

angular
    .module('zeusclientApp')
    .factory('chat', ['$rootScope', 'Hub', 'baseUrl', 'authService', function($rootScope, Hub, baseUrl, authService) {

        var hub = null;
        var ChatHub = this;
        ChatHub.connected = [];

        ChatHub.createHub = function() {
            var token = authService.getToken();
            var hub = new Hub('chatHub', {

                queryParams: { 'access_token': token.access_token },

                rootPath: baseUrl + '/signalr',

                listeners: {
                    'userConnected': function(username, fullname) {
                        ChatHub.connected.push({ username: username, fullname: fullname });
                        $rootScope.$apply();
                    },
                    'userDisconnected': function(username) {
                        ChatHub.connected.splice(ChatHub.connected.indexOf(username), 1);
                        $rootScope.$apply();
                    }
                },
                methods: ['getConnectedUsers'],
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

            hub.connect();
        };

        ChatHub.connect = function() { hub.connect(); };
        ChatHub.disconnect = function() { hub.disconnect(); }

        return ChatHub;
    }]);