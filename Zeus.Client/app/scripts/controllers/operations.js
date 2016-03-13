'use strict';

angular
    .module('zeusclientApp')
    .controller('OperationsCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.operations = [];

        $scope.operationcolumns = [
             { Caption: 'Τύπος', Field: 'Type', Type: 'Lookup', Values: lookupService.operationTypes, Tooltip: 'Τύπος Επιχείρησης' },
             { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
             { Caption: 'Έναρξη', Field: 'Start', Type: 'DateTime', Tooltip: 'Ημερομηνία Έναρξης' },
             { Caption: 'Εκτιμ. Πέρας', Field: 'ETA', Type: 'DateTime', Tooltip: 'Εκτιμώμενη Ημερομηνία Πέρατος' },
             { Caption: 'Πέρας', Field: 'End', Type: 'DateTime', Tooltip: 'Ημερομηνία Πέρατος' },
             { Caption: 'Σημείο Αναχώρησης', Field: 'StartFacility.Name', Tooltip: 'Σημείο Αναχώρησης' },
             { Caption: 'Προορισμός', Field: 'DestinationFacility.Name', Tooltip: 'Σημείο Προορισμού' },
             { Caption: 'Πλήθος Ατ.', Field: 'PersonCount', Tooltip: 'Πλήθος Ατόμων' },
             { Caption: 'Προετοιμασία', Field: 'IsPreparationCompleted', Type: 'Boolean', Tooltip: 'Έχει Ολοκληρωθεί η Προετοιμασία' },
             { Caption: 'Άκύρωση', Field: 'IsCancelled', Type: 'Boolean', Tooltip: 'Έχει Ακυρωθεί' }
        ];

        $scope.addItem = function () {
            $location.url('/operations/new');
        }

        $scope.openItem = function (operation) {
            $location.url('/operations/' + operation.Id);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/operations'
        }).then(function successCallback(response) {
            $scope.operations = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
