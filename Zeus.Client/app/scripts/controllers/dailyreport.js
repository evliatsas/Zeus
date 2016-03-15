'use strict';

angular
    .module('zeusclientApp')
    .controller('DailyReportCtrl', function ($scope, $http, baseUrl, messageService) {

        $scope.reportcolumns = [
            { Caption: 'Δομή Φιλοξενίας', Field: 'Facility.Name' },
            { Caption: 'Παραμένουν', Field: 'Attendance' },
            { Caption: 'Χωρητικότητα Από', Field: 'Capacity' },
            { Caption: 'Χωρητικότητα Εώς', Field: 'ReportCapacity' },
            { Caption: 'Αφίξεις - Αναχωρήσεις', Field: 'Arrivals' }
        ];

        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        $scope.data = { reportDate : new Date(year, month, day)};

        $scope.getData = function (myDate) {
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            $http({
                method: 'GET',
                url: baseUrl + '/facilities/getreport/view/' + year + '/' + month + '/' + day
            }).then(function successCallback(response) {
                $scope.reports = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.data.Message);
            });
        }

        $scope.showPdf = function (myDate) {
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var url = baseUrl + '/facilities/getreport/pdf/' + year + '/' + month + '/' + day;
            window.open(url);
        }

        $scope.$watch("data.reportDate", function (newvalue, oldvalue) { if (oldvalue != newvalue) $scope.getData(newvalue);})

        $scope.getData($scope.data.reportDate);
    });
