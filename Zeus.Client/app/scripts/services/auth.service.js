(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('authService', authService);

    function authService($http, $q, $location, $sanitize, localStorageService, baseUrl, messageService) {

        var service = {
            login: login,
            logout: logout,
            fillAuthData: fillAuthData,
            fillUserInfo: fillUserInfo,
            changePassword: changePassword,
            isInRole: isInRole,
            isAuth: isAuth,
            authentication: {
                isAuth: false,
                userName: "",
                token: ""
            },
            info: {
                title: "",
                email: "",
                claims: [],
                roles: [],
                expiresAt: {}
            }
        };

        return service;

        function isAuth(){
            var token = localStorageService.get('authorizationData');
            return token!=null;
        };

        function login (loginData) {

            var deferred = $q.defer();

            $http({
                url: 'http://localhost:8080/api/oauth2/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { username: loginData.userName, password: $sanitize(loginData.password), grant_type: "password", client_id: "099153c2625149bc8ecb3e85e03f0022" }
            }).then(function (response) {
                localStorageService.set('authorizationData', response.data);
                service.authentication.isAuth = true;
                service.authentication.userName = loginData.userName;
                service.authentication.token = response.data.access_token;
                $location.path("/");
                deferred.resolve(response);
            }, function (error) {
                messageService.showError();
                logout();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        function fillUserRoles(info) {
            var roles = [];
            for (var index in info.Roles) {
                var claim = info.Roles[index];
                claim = JSON.parse(claim);
                var role = {
                    Name: claim.RoleName,
                    Value: claim.Specification
                }
                roles.push(role);
            }

            return roles;
        }

        function logout () {
            localStorageService.remove('authorizationData');

            service.authentication.isAuth = false;
            service.authentication.userName = "";
            service.authentication.token = "";

            service.info.title = "";
            service.info.email = "";
            service.info.claims = [];
            service.info.roles = [];
        };

        function fillAuthData() {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                service.authentication.isAuth = true;
                service.authentication.userName = authData.userName;
                service.authentication.token = authData.token;
            }
        };

        function fillUserInfo() {
            var info = localStorageService.get('userInfo');
            if (info) {
                service.info.title = info.title;
                service.info.email = info.email;
                service.info.claims = info.claims;
                service.info.roles = info.roles;
            }
        };

        function changePassword(userId, oldPassword, newPassword) {
            var value = { userId: userId, oldPassword: $sanitize(oldPassword), newPassword: $sanitize(newPassword) };
            return $http(
                {
                    method: 'POST',
                    url: baseUrl + '/users/password',
                    data: value
                }).
                success(function (data, status, headers, config) {
                    return data;
                }).
                error(function (data, status, headers, config) {
                    messageService.showError(data.Message);
                });
        }

        function isInRole(role) {
            var r = service.info.roles;
            for (var i in r) {
                if (r[i].Name == role)
                    return true;
            }

            return false;
        }

        function getRoleValue(role) {
            if (isInRole(role)) {
                return role.Value;
            }
            else {
                return null;
            }
        }
    }
})();