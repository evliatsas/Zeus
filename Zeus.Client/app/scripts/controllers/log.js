'use strict';

angular
    .module('zeusclientApp')
    .controller('LogCtrl', function ($scope, $http, baseUrl, lookupService, messageService, utilitiesService) {

        $scope.lookup = lookupService;
        $scope.util = utilitiesService;
        $scope.entries = [];
        $scope.from = moment().subtract(7, 'days').startOf('day');
        $scope.to = moment();

        $scope.entriescolumns = [
            { Caption: 'Τ', Field: 'Level', Type: 'LookupHtml', Values: lookupService.entryLevelsHtml, Tooltip: 'Επίπεδο' },
            { Caption: 'Ημερομηνία', Field: 'Timestamp' },
            { Caption: 'Εγγραφή', Field: 'RenderedMessage' }
        ];

        $scope.getLog = function () {
            var dates = {
                from: $scope.from,
                to: $scope.to
            };
            $http({
                method: 'POST',
                data: dates,
                url: baseUrl + '/common/log'
            }).then(function successCallback(response) {
                $scope.entries = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
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
