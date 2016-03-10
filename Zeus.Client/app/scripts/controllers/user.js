'use strict';

angular
    .module('zeusclientApp')
    .controller('UserCtrl', function ($scope, $http, $routeParams, $location, baseUrl, messageService) {

        var isInsert = $routeParams.id == 'new';

        $scope.usercolumns = [
          { Caption: 'Όνοματεπώνυμο', Field: 'FullName' },
          { Caption: 'Αναγνωριστικό', Field: 'UserName' },
          { Caption: 'Email', Field: 'Email' },
          { Caption: 'Τηλέφωνο', Field: 'PhoneNumber' }
        ];

        if (isInsert) {
            $scope.data = {};
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/users/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.user = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.addUser = function () {
            
        }

        // SAVE - DELETE
        $scope.save = function () {
            if (isInsert) {
                // Create user
                var method = 'POST';
            }
            else {
                // Update user
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.user,
                url: baseUrl + '/contacts'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.user = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteItem = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/users/' + $scope.user.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/users');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteItem);
        }
    });
