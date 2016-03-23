'use strict';

angular
    .module('zeusclientApp')
    .controller('ProvidersCtrl', function ($scope, $http, $location, lookupService, messageService, utilitiesService, baseUrl) {

        $scope.util = utilitiesService;
        $scope.lookup = lookupService;
        $scope.providers = [];

        $scope.providercolumns = [
             { Caption: 'GRID.TYPE', Field: 'Type', Type:'Lookup', Values: lookupService.providerTypes, Tooltip: 'Τύπος Προμηθευτή' },
             { Caption: 'GRID.NAME', Field: 'Name', Tooltip: 'Όνομα Προμηθευτή' },
             { Caption: 'GRID.DESCRIPTION', Field: 'Description', Tooltip: 'Περιγραφή Προμηθευτή' },
             { Caption: 'GRID.PERSONNEL', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
             { Caption: 'GRID.ADMINISTRATION', Field: 'Administration', Tooltip: 'Διοικητική Υπαγωγή' }
        ];

        $scope.addItem = function () {
            $location.url('/providers/new');
        }

        $scope.openItem = function (provider) {
            $location.url('/providers/' + provider.Id);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/providers'
        }).then(function successCallback(response) {
            $scope.providers = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
