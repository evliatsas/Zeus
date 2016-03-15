'use strict';

angular
    .module('zeusclientApp')
    .controller('CalendarEntryCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.entry = {};

        var isInsert = $routeParams.id == 'new';

        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/calendar/' + $routeParams.id //the unique id of the operation
            }).then(function successCallback(response) {
                $scope.entry = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }
        else {
            $scope.entry.DateTime=new Date();
        }

        $scope.save = function () {
            if (isInsert) {
                // Create CalendarEntry
                var method = 'POST';
            }
            else {
                // Update CalendarEntry
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.entry,
                url: baseUrl + '/calendar'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                if (isInsert)
                    $location.url('/calendar/' + response.data.Id);
                else
                    $scope.entry = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        var deleteEntry = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/calendar/' + $scope.entry.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/calendar');
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteEntry);
        }

    });
