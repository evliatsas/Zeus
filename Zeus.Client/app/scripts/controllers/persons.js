'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonsCtrl', function ($scope, $location, $http, baseUrl, lookupService, messageService, utilitiesService) {

        $scope.util = utilitiesService;

        $scope.addItem = function() {
            $location.url("/persons/new");
        }

        $scope.editPerson = function(person) {
            $location.url("/persons/" + person.Id);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities' //lookup facilities
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
            $scope.personcolumns = [
                { Caption: 'Όνομα', Field: 'Name' },
                { Caption: 'Εθνικότητα', Field: 'Nationality' },
                { Caption: 'Διαβατήριο', Field: 'Passport' },
                { Caption: 'Ηλικία', Field: 'Age', Type: 'Number' },
                { Caption: 'Ευπαθής', Field: 'IsSensitive', Type: 'Boolean' },
                { Caption: 'Ευπάθεια', Field: 'Sensitivity' },
                { Caption: 'Δομή', Field: 'FacilityId', Type: 'Lookup', Values: $scope.facilities }
            ];
        }, function errorCallback(response) {
            $scope.facilities = [];
            messageService.getFailed(response.error);
        }).then(function() {
            $http({
                method: 'GET',
                url: baseUrl + '/persons'
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        });
    });
