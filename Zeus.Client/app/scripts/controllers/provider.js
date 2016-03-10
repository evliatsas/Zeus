'use strict';

angular
    .module('zeusclientApp')
    .controller('ProviderCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        var isInsert = $routeParams.id == 'new';

        $scope.lookup = lookupService;
        $scope.provider = {};

        $scope.lookupColumns = [
            { Caption: 'Όνομα', Field: 'Description' }
        ];

        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/providers/' + $routeParams.id //the unique id of the provider
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
           $scope.provider.Items.push({"Id":"", "Description":""});
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
                $location.url('/providers');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteProvider);
        }

        $scope.deleteContact = function () {
            messageService.askDeleteConfirmation(removeContact);
        }

        $scope.deleteFacility = function () {
            messageService.askDeleteConfirmation(removeFacility);
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
