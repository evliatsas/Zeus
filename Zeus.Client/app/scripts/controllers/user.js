'use strict';

angular
    .module('zeusclientApp')
    .controller('UserCtrl', function ($scope, $http, $routeParams, $location, baseUrl, messageService, authService) {

        $scope.isInsert = $routeParams.id == 'new';

        $scope.usercolumns = [
          { Caption: 'Όνοματεπώνυμο', Field: 'FullName' },
          { Caption: 'Αναγνωριστικό', Field: 'UserName' },
          { Caption: 'Email', Field: 'Email' },
          { Caption: 'Τηλέφωνο', Field: 'PhoneNumber' }
        ];

        if ($scope.isInsert) {
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

        // SAVE - DELETE
        $scope.save = function () {
            if ($scope.isInsert) {
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
                url: baseUrl + '/users'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.user = response.data;
                $location.url('/users');
            }, function errorCallback(response) {
                messageService.showError(response.data.Message);
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

        $scope.changePassword = function () {
            authService.changePassword($scope.user.Id, $scope.user.NewPassword, $scope.user.PasswordConfirm);
        }
    });
