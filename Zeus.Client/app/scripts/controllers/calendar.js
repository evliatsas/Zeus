'use strict';

angular
    .module('zeusclientApp')
    .controller('CalendarCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.calendar = [];

        $scope.calendarcolumns = [
             { Caption: 'CALENDAR.TIME', Field: 'Start', Type: 'DateTime', Tooltip: 'Ώρα' },
             { Caption: 'CALENDAR.TYPE', Field: 'Type', Type: 'Lookup', Values: lookupService.administrations, Tooltip: 'Φορέας' },
             { Caption: 'CALENDAR.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
             { Caption: 'CALENDAR.SUBJECT', Field: 'Περιγραφή Αναφοράς' },
             { Caption: 'CALENDAR.ACTIONS', Field: 'Actions', Tooltip: 'Πλήθος Ατόμων' },
             { Caption: 'CALENDAR.ISARCHIVE', Field: 'IsArchive', Type: 'Boolean', Tooltip: 'Έχει Ολοκληρωθεί η Προετοιμασία' },
        ];
    });
