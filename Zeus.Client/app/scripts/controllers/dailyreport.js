'use strict';

angular
    .module('zeusclientApp')
    .controller('DailyReportCtrl', function ($scope, $http, baseUrl, messageService) {

        $scope.reportcolumns = [
            { Caption: 'Δομή Φιλοξενίας', Field: 'Facility.Name' },
            { Caption: 'GRID.NAME', Field: 'Attendance' },
            { Caption: 'GRID.COMPANY', Field: 'Capacity' },
            { Caption: 'GRID.ADMINISTRATION', Field: 'ReportCapacity' },
            { Caption: 'GRID.TYPE', Field: 'Arrivals' }
        ];

        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var day = new Date().getDate();

        $http({
            method: 'GET',
            url: baseUrl + '/facilities/getreport/view/' + year + '/' + month + '/' + day
        }).then(function successCallback(response) {
            $scope.reports = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.data.Message);
        });

        $scope.showPdf = function () {
            var url = baseUrl + '/facilities/getreport/pdf/' + year + '/' + month + '/' + day;
            window.open(url);
        }

    });
