'use strict';

angular
    .module('zeusclientApp')
    .controller('ProvidersCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.providers = [];

        $scope.columns = [
             { Caption: 'Τύπος', Field: 'Type', Values: lookupService.providerTypes, Tooltip: 'Τύπος Προμηθευτή' },
             { Caption: 'Όνομα', Field: 'Name', Tooltip: 'Όνομα Προμηθευτή' },
             { Caption: 'Περιγραφή', Field: 'Description', Tooltip: 'Περιγραφή Προμηθευτή' },
             { Caption: 'Προσωπικό', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
             { Caption: 'Υπαγωγή', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Διοικητική Υπαγωγή' }
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
