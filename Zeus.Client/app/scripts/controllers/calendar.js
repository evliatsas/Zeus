'use strict';

angular
    .module('zeusclientApp')
    .controller('CalendarCtrl', function ($scope, $http, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.calendar = [];

        $scope.calendarcolumns = [
             { Caption: 'GRID.DATETIME', Field: 'Start', Type: 'DateTime', Tooltip: 'Ώρα' },
             { Caption: 'CALENDAR.AUTHOR', Field: 'Start', Type: 'DateTime', Tooltip: 'Ώρα' },
             { Caption: 'CALENDAR.ADMINISTRATION', Field: 'Type', Type: 'Lookup', Values: lookupService.administrations, Tooltip: 'Υπαγωγή' },
             { Caption: 'CALENDAR.DESCRIPTION', Field: 'Περιγραφή Αναφοράς' },
             { Caption: 'CALENDAR.ACTIONS', Field: 'Actions', Tooltip: 'Ενέργειες' }
        ];

        $scope.addItem = function () {
            $location.url('/calendar/new');
        }

        $scope.openItem = function (entry) {
            $location.url('/calendar/' + entry.Id);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/calendar'
        }).then(function successCallback(response) {
            $scope.calendar = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });
    });
