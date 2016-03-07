'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonCtrl', function ($scope, $http, $routeParams, baseUrl, lookupService) {

        $scope.reportcolumns = [
            { Caption: 'Όνομα', Field: 'Name' },
            { Caption: 'Εθνικότητα', Field: 'Nationality' },
            { Caption: 'Διαβατήριο', Field: 'Passport' },
            { Caption: 'Ηλικία', Field: 'Age', Type: 'Number' },
            { Caption: 'Ευπαθής', Field: 'IsSensitive', Type: 'Boolean' },
            { Caption: 'Ευπάθεια', Field: 'Sensitivity' },
            { Caption: 'Δομή', Field: 'Facility.Name' }
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            messageService.showError();
        });

        $http({
            method: 'GET',
            url: basseUrl + '/persons/' + $routeParams.id
        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
            messageService.showError();
        });
        
        $scope.addRelative = function () {
            alert('add relative');
        }
    });
