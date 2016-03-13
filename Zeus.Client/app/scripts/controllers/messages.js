'use strict';

angular
    .module('zeusclientApp')
    .controller('MessagesCtrl', function ($scope, $http, $location, $routeParams, baseUrl, lookupService, messageService) {

        $scope.lookup = lookupService;

        $scope.reportcolumns = [
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Δομή Φιλοξενίας', Field: 'Facility.Name' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        $scope.showReport = function (report) {
            var location = '/reports/' + report.Type + '/' + report.FacilityId + '/' + report.Id;
            $location.url(location);
        }

        $http({
            method: 'GET',
            url: baseUrl + '/reports/messages'
        }).then(function successCallback(response) {
            $scope.reports = response.data;
        }, function errorCallback(response) {
            messageService.showError();
        });
    });