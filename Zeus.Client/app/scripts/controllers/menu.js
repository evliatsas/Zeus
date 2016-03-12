'use strict';

angular
    .module('zeusclientApp')
    .controller('MenuCtrl', function($http, $location, authService, baseUrl) {
        this.getClass = function(path) {
            if ($location.path() === path) {
                return 'active';
            } else {
                return '';
            }
        }

        this.isAuth = function () {
            return authService.isAuth();
        }

        this.logOut = function () {
            authService.logout();
            $location.url("/login");
        }

        this.changePassword = function (password,newPassword,passwordConfirm) {
            authService.changePassword("", password, newPassword, passwordConfirm);
        }

        //unreadMsgs();

        //this.unreadMsgs = function () {
        //    $http({
        //        method: 'GET',
        //        url: baseUrl + '/reports/message/unread'
        //    }).then(function successCallback(response) {
        //        this.unread = response.data;
        //    }, function errorCallback(response) {
        //        this.unread = 0;
        //    });
        //}
    });
