'use strict';

angular
    .module('zeusclientApp')
    .controller('ArchiveCtrl', function ($scope, $http, $routeParams, $uibModal, $location, baseUrl, lookupService, messageService) {

        $scope.lookup = lookupService;
        $scope.reports = [];
        $scope.from = moment().subtract(7, 'days').startOf('day');
        $scope.to = moment();

        $scope.reportcolumns = [
            { Caption: 'GRID.TYPE', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'GRID.FACILITY', Field: 'Facility.Name' },
            { Caption: 'GRID.SUBJECT', Field: 'Subject' },
            { Caption: 'GRID.AUTHOR', Field: 'User.Title' },
            { Caption: 'GRID.DATETIME', Field: 'DateTime', Type: 'DateTime' }
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

        $scope.beforeRenderStartDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            if ($scope.to) {
                var activeDate = moment($scope.to);
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
                }
            }
        }

        $scope.beforeRenderEndDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            if ($scope.from) {
                var activeDate = moment($scope.from).subtract(1, $view).add(1, 'minute');
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                        $dates[i].selectable = false;
                    }
                }
            }
        }
    });
