'use strict';

angular
    .module('zeusclientApp')
    .controller('LogCtrl', function ($scope, $http, baseUrl, lookupService, messageService) {

        $scope.lookup = lookupService;
        $scope.entries = [];
        $scope.from = new Date();
        $scope.to = new Date();

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
                messageService.showError();
            });
        }
    });
