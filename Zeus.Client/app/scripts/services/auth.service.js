(function() {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('authService', authService);

    function authService($http, $q, $location, $sanitize, $rootScope, localStorageService, baseUrl, authUrl, messageService, chat) {

        var service = {
            login: login,
            logout: logout,
            changePassword: changePassword,
            isInRole: isInRole,
            data: {
                isAuth: false,
                isAdmin: false,
                userName: "",
                fullName: "",
                token: "",
                email: "",
                claims: [],
                roles: []
            }
        };

        function login(loginData) {

            var deferred = $q.defer();

            $http({
                url: authUrl,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { username: loginData.userName, password: $sanitize(loginData.password), grant_type: "password", client_id: "099153c2625149bc8ecb3e85e03f0022" }
            }).then(function(response) {                
                service.data.isAuth = true;
                service.data.userName = loginData.userName;
                service.data.token = response.data.access_token;
                localStorageService.set('authorization', service.data);
                $http({
                    method: 'GET',
                    url: baseUrl + '/users/self'
                }).then(function successCallback(response) {
                    var info = response.data;
                    service.data.fullName = info.FullName;
                    service.data.email = info.Email;
                    service.data.roles = info.Roles;
                    service.data.claims = info.Claims;
                    localStorageService.set('authorization', service.data);
                    chat.setToken(service.data.token);
                    chat.connect();
                    $location.path("/");
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    messageService.showError(response.data.error_description);
                    logout();
                    deferred.reject(error);
                });
            }, function(error) {
                messageService.showError(error);
                logout();
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function cleanData() {
            service.data.isAuth = false;
            service.data.isAdmin = false;
            service.data.userName = "";
            service.data.token = "";
            service.data.fullName = "";
            service.data.email = "";
            service.data.claims = [];
            service.data.roles = [];
        }

        function logout() {
            chat.disconnect();
            localStorageService.remove('authorization');
            cleanData();
            $location.url("/");
        };

        function fillData() {
            var authData = localStorageService.get('authorization');
            if (authData) {
                service.data.isAuth = true;
                service.data.isAdmin = $.inArray('Administrator', authData.roles) > -1;
                service.data.userName = authData.userName;
                service.data.fullName = authData.fullName;
                service.data.token = authData.token;
                service.data.email = authData.email;
                service.data.roles = authData.roles;
                service.data.claims = authData.claims;
                chat.setToken(service.data.token);
                chat.connect();
            } else {
                cleanData();
                chat.disconnect();
            }
        };

        function changePassword(user, action) {
            var url = baseUrl + '/users/changepassword';

            if (action == "reset")
                url = baseUrl + '/users/resetpassword';

            user.Password = $sanitize(user.Password),
                user.NewPassword = $sanitize(user.NewPassword);
            user.PasswordConfirm = $sanitize(user.PasswordConfirm);
            return $http({
                method: 'POST',
                url: url,
                data: user
            }).
            success(function(data, status, headers, config) {
                messageService.saveSuccess();
            }).
            error(function(data, status, headers, config) {
                messageService.showError(data.Message);
            });
        }

        function isInRole(role) {
            var r = service.data.roles;
            for (var i in r) {
                if (r[i].Name == role)
                    return true;
            }
            return false;
        }

        fillData();
        return service;
    }
})();