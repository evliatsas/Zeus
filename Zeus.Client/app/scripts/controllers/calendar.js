'use strict';

angular
    .module('zeusclientApp')
    .controller('CalendarCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.calendar = [];

        $scope.calendarcolumns = [
             { Caption: 'GRID.START', Field: 'Start', Type: 'DateTime', Tooltip: 'Ώρα' },
             { Caption: 'GRID.TYPE', Field: 'Type', Type: 'Lookup', Values: lookupService.administrations, Tooltip: 'Φορέας' },
             { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
             { Caption: 'GRID.SUBJECT', Field: 'Περιγραφή Αναφοράς' },
             { Caption: 'GRID.ACTIONS', Field: 'Actions', Tooltip: 'Πλήθος Ατόμων' },
             { Caption: 'GRID.ISARCHIVE', Field: 'IsArchive', Type: 'Boolean', Tooltip: 'Έχει Ολοκληρωθεί η Προετοιμασία' },
        ];
    });
