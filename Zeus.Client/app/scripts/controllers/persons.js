'use strict';

angular
    .module('zeusclientApp')
    .controller('UsersCtrl', function ($scope, $location, $http, baseUrl, lookupService, messageService) {

        $scope.addPerson = function () {
            $location.url("/Users/new");
        }

        $scope.showPerson = function (user)
        {
            $location.url("/Users/" + user.Id);
        }

        $scope.reportcolumns = [
            { Caption: 'Όνοματεπώνυμο', Field: 'Name' },
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
