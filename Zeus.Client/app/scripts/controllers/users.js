'use strict';

angular
    .module('zeusclientApp')
    .controller('UsersCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {
        
        //$scope.users = [];

        $scope.usercolumns = [
           { Caption: 'Όνοματεπώνυμο', Field: 'FullName' },
           { Caption: 'Αναγνωριστικό', Field: 'UserName' },
           { Caption: 'Email', Field: 'Email' },
           { Caption: 'Τηλέφωνο', Field: 'PhoneNumber' },
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/users'
        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.addItem = function () {
            $location.url("/users/new");
        }

        $scope.openItem = function (user) {
            $location.url("/users/" + user.Id);
        }

    });
