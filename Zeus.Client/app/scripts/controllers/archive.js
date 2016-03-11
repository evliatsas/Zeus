'use strict';

angular
    .module('zeusclientApp')
    .controller('ArchiveCtrl', function ($scope, $http, $routeParams, $uibModal, $location, baseUrl, lookupService, messageService) {

        $scope.lookup = lookupService;
        $scope.reports = [];
        $scope.from = new Date();
        $scope.to = new Date();

        $scope.reportcolumns = [
            { Caption: 'Τ', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Δομή Φιλοξενίας', Field: 'Facility.Name' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        $scope.getArchived = function () {
            var dates = {
                from: $scope.from,
                to: $scope.to
            };
            $http({
                method: 'POST',
                data: dates,
                url: baseUrl + '/reports/archive'
            }).then(function successCallback(response) {
                $scope.reports = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.showReport = function (report) {
            var location = '/reports/' + report.Type + '/' + report.FacilityId + '/' + report.Id;
            $location.url(location);
        }
    });
