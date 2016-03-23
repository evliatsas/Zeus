'use strict';

angular
    .module('zeusclientApp')
    .controller('CalendarCtrl', function ($scope, $http, $location, lookupService, utilitiesService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.util = utilitiesService;
        $scope.calendar = [];

        $scope.calendarcolumns = [
             { Caption: 'GRID.DATETIME', Field: 'DateTime', Type: 'DateTime', Tooltip: 'Ώρα' },
             { Caption: 'CALENDAR.AUTHOR', Field: 'Author', Tooltip: 'Ώρα' },
             { Caption: 'CALENDAR.DESCRIPTION', Field: 'Description', Tooltip: 'Περιγραφή Αναφοράς' },
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
