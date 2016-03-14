'use strict';

angular
    .module('zeusclientApp')
    .controller('OperationsCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.operations = [];

        $scope.operationcolumns = [
             { Caption: 'GRID.TYPE', Field: 'Type', Type: 'Lookup', Values: lookupService.operationTypes, Tooltip: 'Τύπος Επιχείρησης' },
             { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
             { Caption: 'GRID.NAME', Field: 'Name' },
             { Caption: 'GRID.START', Field: 'Start', Type: 'DateTime', Tooltip: 'Ημερομηνία Έναρξης' },
             { Caption: 'GRID.ETA', Field: 'ETA', Type: 'DateTime', Tooltip: 'Εκτιμώμενη Ημερομηνία Πέρατος' },
             { Caption: 'GRID.END', Field: 'End', Type: 'DateTime', Tooltip: 'Ημερομηνία Πέρατος' },
             { Caption: 'OPERATION.STARTFACILITY', Field: 'StartFacility.Name', Tooltip: 'Σημείο Αναχώρησης' },
             { Caption: 'OPERATION.DESTFACILITY', Field: 'DestinationFacility.Name', Tooltip: 'Σημείο Προορισμού' },
             { Caption: 'OPERATION.PERSON_COUNT', Field: 'PersonCount', Tooltip: 'Πλήθος Ατόμων' },
             { Caption: 'OPERATION.PREPERATIONS', Field: 'IsPreparationCompleted', Type: 'Boolean', Tooltip: 'Έχει Ολοκληρωθεί η Προετοιμασία' },
             { Caption: 'GRID.CANCEL', Field: 'IsCancelled', Type: 'Boolean', Tooltip: 'Έχει Ακυρωθεί' }
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
