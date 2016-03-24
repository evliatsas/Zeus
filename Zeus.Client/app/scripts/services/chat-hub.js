'use strict';

angular
    .module('zeusclientApp')
    .factory('ChatHub', ['$rootScope', 'Hub', 'baseUrl', '$filter', function($rootScope, Hub, baseUrl, $filter) {

        var ChatHub = this;
        ChatHub.connected = [];
        ChatHub.messages = [];
        ChatHub.users = [];
        ChatHub.unread = 0;
        ChatHub.isConnected = false;

        var hub = new Hub('chatHub', {
            autoConnect: false,
            rootPath: baseUrl + '/signalr',
            listeners: {
                'userConnected': function(username, fullname) {
                    ChatHub.connected.push({ username: username, fullname: fullname });
                    $filter('filter')(ChatHub.users,function(u) {
                        return u.UserName == username;
                    })[0].Connected = true;
                    $rootScope.$apply();
                },
                'userDisconnected': function(username) {                    
                    var user = $filter('filter')(ChatHub.connected,function(u) {
                        return u.UserName == username;
                    })[0];
                    ChatHub.connected.splice(ChatHub.connected.indexOf(user),1);
                    $filter('filter')(ChatHub.users,function(u) {
                        return u.UserName == username;
                    })[0].Connected = false;

                    $rootScope.$apply();
                },
                'received': function(message) {
                    ChatHub.messages.push(message);
                    $rootScope.$apply();
                },
                'notify': function (priority, title, message) {
                    if (priority == 0){
                        toastr.info(message, title, { closeButton: true, timeOut: 30000 });
                    }                        
                    else if (priority < 3) {
                        toastr.warning(message, title, { closeButton: true, timeOut: 60000 });
                    }
                    else {
                        toastr.error(message, title, { closeButton: true, timeOut: 60000 });
                    }
                }
            },
            methods: ['getConnectedUsers','getUnreadCount','getMessages','getArchives','getUsers','send','checkMessage','archiveMessage'],
            errorHandler: function(error) {
                console.error(error);
            },
            stateChanged: function(state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        break;
                    case $.signalR.connectionState.connected:
                        ChatHub.isConnected = true;
                        ChatHub.connected.splice(0, ChatHub.connected.length);
                        $rootScope.$apply();
                        hub.getUnreadCount().done(function(num) {
                            ChatHub.unread = num;
                        });
                        if(cb) {
                            cb();
                        }            
                        break;
                    case $.signalR.connectionState.reconnecting:
                        break;
                    case $.signalR.connectionState.disconnected:
                        ChatHub.isConnected = false;
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
        ChatHub.checkMessage = hub.checkMessage;
        ChatHub.archiveMessage = hub.archiveMessage;

        var cb = null;
        ChatHub.observe = function(callback) {
            cb = callback;
        };

        ChatHub.setToken = function(token) {
            hub.connection.qs = {'access_token': token };
        };
        return ChatHub;
    }]);