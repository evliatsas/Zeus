'use strict';

angular
    .module('zeusclientApp')
    .controller('LoginCtrl', function ($scope, $http, $location, messageService, localStorageService) {

        $scope.login = function () {
            $http({
                url: 'http://localhost:8080/oauth2/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { username: $scope.username, password: $scope.password, grant_type: "password", client_id:"099153c2625149bc8ecb3e85e03f0022" }
            }).then(function (response) {
                localStorageService.set('jwt', response.data);
                $location.path("/");
            }, function (error) {
                messageService.showError();
            });
        }

    });
