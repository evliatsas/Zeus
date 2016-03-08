'use strict';

angular
    .module('zeusclientApp')
    .controller('ProviderCtrl', function ($scope, $http, $routeParams, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.provider = {};

        $scope.lookupColumns = [
            { Caption: 'Όνομα', Field: 'Description' }
        ];

        var isInsert = $routeParams.pid == 'new';
        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/providers/' + $routeParams.pid //the unique id of the provider
            }).then(function successCallback(response) {
                $scope.provider = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }
        else {
            $scope.provider = {};
            $scope.provider.Items = [];
        }

        var i = 1;
        $scope.addItem = function () {
            i++;
            $scope.provider.Items.push({"Id":i,"Description":"Test"});
        }

        $scope.removeItem = function (index) {
            $scope.provider.Items.splice(index, 1);
        }

        $scope.save = function () {
            if (isInsert) {
                // Create provider
                var method = 'POST';
            }
            else {
                // Update provider
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.provider,
                url: baseUrl + '/providers'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteProvider = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/providers/' + $scope.provider.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askConfirmation(deleteProvider);
        }

        $scope.deleteContact = function () {
            messageService.askConfirmation(removeContact);
        }

        $scope.deleteFacility = function () {
            messageService.askConfirmation(removeFacility);
        }

        var removeContact = function (index, contactId) {
            $http({
                method: 'DELETE',
                url: baseUrl + '/providers/contacts/' + contactId
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                provider.Contacts.splice(index, 1);
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var removeFacility = function (index, facilityId) {
            $http({
                method: 'DELETE',
                url: baseUrl + '/providers/facilities/' + facilityId
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                provider.Facilities.splice(index, 1);
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

    });
