'use strict';

angular
    .module('zeusclientApp')
    .controller('ReportsCtrl', function($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.reports = [];
        $scope.reportType = $routeParams.type;

        var getReportType = function() {
            switch ($scope.reportType) {
                case "0":
                    return 'FeedingReport';
                case "1":
                    return 'HousingReport';
                case "2":
                    return 'MovementReport'
                case "3":
                    return 'ProblemReport';
                case "4":
                    return 'RequestReport';
                case "5":
                    return 'SituationReport';
                case "6":
                    return 'Message';
            }
        }

        $scope.reportcolumns = [
            { Caption: 'GRID.TYPE', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'GRID.FACILITY', Field: 'Facility.Name' },
            { Caption: 'GRID.SUBJECT', Field: 'Subject' },
            { Caption: 'GRID.AUTHOR', Field: 'User.Title' },
            { Caption: 'GRID.DATETIME', Field: 'DateTime', Type: 'DateTime' }
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/reports/type/' + $routeParams.type //the unique id of the report
        }).then(function successCallback(response) {
            $scope.reports = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
