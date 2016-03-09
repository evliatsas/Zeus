'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonsCtrl', function ($scope, $location, $http, baseUrl, lookupService, messageService) {

        $scope.addPerson = function () {
            $location.url("/persons/new");
        }

        $scope.showPerson = function (person)
        {
            $location.url("/persons/" + person.Id);
        }

        $scope.personcolumns = [
            { Caption: 'Όνομα', Field: 'Name' },
            { Caption: 'Εθνικότητα', Field: 'Nationality' },
            { Caption: 'Διαβατήριο', Field: 'Passport' },
            { Caption: 'Ηλικία', Field: 'Age', Type: 'Number' },
            { Caption: 'Ευπαθής', Field: 'IsSensitive', Type: 'Boolean' },
            { Caption: 'Ευπάθεια', Field: 'Sensitivity' },
            { Caption: 'Δομή', Field: 'Facility.Name'}
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/persons'
        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });
    });
