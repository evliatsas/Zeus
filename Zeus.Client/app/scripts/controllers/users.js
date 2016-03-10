'use strict';

angular
    .module('zeusclientApp')
    .controller('UsersCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {
        
        var isInsert = $routeParams.id == 'new';

        $scope.usercolumns = [
           { Caption: 'Όνοματεπώνυμο', Field: 'FullName' },
           { Caption: 'Αναγνωριστικό', Field: 'UserName' },
           { Caption: 'Email', Field: 'Email' },
           { Caption: 'Τηλέφωνο', Field: 'PhoneNumber' },
        ];

        $scope.contact = {};

        $scope.addUser = function () {
            $location.url("/users/new");
        }

        $scope.openUser = function (user) {
            if (!isInsert) {
                $location.url('/users/' + user.Id);
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
