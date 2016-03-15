'use strict';

angular
    .module('zeusclientApp')
    .controller('UsersCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {
        
        var isInsert = $routeParams.id == 'new';

       // $scope.showPassword = true;

        $scope.usercolumns = [
           { Caption: 'USER.FULLNAME', Field: 'FullName' },
           { Caption: 'USER.ADMINISTRATION', Field: 'Administration' },
           { Caption: 'USER.USERNAME', Field: 'UserName' },
           { Caption: 'Email', Field: 'Email' },
           { Caption: 'USER.PHONENUMBER', Field: 'PhoneNumber' },
        ];

        $scope.user = {};

        $scope.addUser = function () {
            $location.url("/users/new");
        }

        $scope.openUser = function (user) {
            if (!isInsert) {
                $location.url('/users/' + user.UserName);
            } else {
                $location.url('/users/new');
            }
        }

        $http({
            method: 'GET',
            url: baseUrl + '/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
