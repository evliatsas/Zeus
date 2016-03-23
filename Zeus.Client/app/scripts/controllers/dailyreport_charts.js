'use strict';

angular
    .module('zeusclientApp')
    .controller('DailyReportChartsCtrl', function ($scope, $http, $filter, baseUrl, utilitiesService, messageService) {

        $scope.facilities = [];
        $scope.charts =null;
        $scope.util = utilitiesService;
        $scope.from = moment().subtract(7, 'days').startOf('day');
        $scope.to = moment();

        $scope.getStats = function (type, from, to) {
            var query = {
                types: [5], //only getting SituationReports for now
                from: $scope.from,
                to: $scope.to
            };
            $http({
                method: 'POST',
                data: query,
                url: baseUrl + '/facilities/getreport/view'
            }).then(function successCallback(response) {
                populateCharts(response.data, 'DD-MM');
            }, function errorCallback(response) {
                messageService.showError(response.message);
            });
        }

        function newChart(labels, series, data) {
            if (series != null && data == null) {
                data = [];
                series.forEach(function (serie, index) {
                    data.push([]);
                });
            }
            var chart = {
                labels: labels || [],
                series: series || [],
                data: data || []
            };
            return chart;
        }

        function populateCharts(reports) {
            $scope.facilities = [];
            $scope.charts = {};

            if (reports == null || reports.length == 0) {
                return;
            }

            $scope.charts.total = newChart(null, ['Φιλοξενούμενοι']);
            $scope.charts.special = newChart(null, ['Αφίξεις - Αναχωρήσεις']);

            var byFacility = utilitiesService.groupBy(reports, function (report) { return report.Facility.Name; });
            byFacility.forEach(function (facilityGroup, facilityIndex) {
                var facility = facilityGroup.items[0].Facility;
                $scope.facilities.push(facility);

                var chart = newChart(null, ['Χωρητικότητα', 'Μέγιστη Χωρητικότητα', 'Φιλοξενούμενοι']);
                $scope.charts[facility.Id] = chart;

                facilityGroup.items.sort(function (a, b) { return a.ReportDate > b.ReportDate; });

                facilityGroup.items.forEach(function (report, index) {
                    var label = utilitiesService.formatDateTime(report.ReportDate, "DD/MM");
                    chart.labels.push(label);

                    var inTotal = $filter('filter')($scope.charts.total.labels, function (l) { return l == label; }).length > 0;
                    if (!inTotal) {
                        $scope.charts.total.labels.push(label);
                        $scope.charts.total.data[0].push(0);
                    }

                    var inSpecial = $filter('filter')($scope.charts.special.labels, function (l) { return l == label; }).length > 0;
                    if (!inSpecial) {
                        $scope.charts.special.labels.push(label);
                        $scope.charts.special.data[0].push(0);
                    }
                    
                    chart.data[0].push(report.Capacity);
                    chart.data[1].push(report.ReportCapacity);
                    chart.data[2].push(report.Attendance);

                    var labelIndex = $scope.charts.total.labels.indexOf(label);
                    $scope.charts.total.data[0][labelIndex] += report.Attendance;
                    $scope.charts.special.data[0][labelIndex] += report.Arrivals;
                });
            });
        }

        // old, more generic code (DONT DELETE IT)
        function generateReportStats(reports, labelsFn, seriesFn, dataFn) {
            if (reports == null || reports.length == 0) {
                $scope.charts = [];
                return;
            }

            var chart = {
                labels: [],
                series: [],
                data: []
            };

            var labels = utilitiesService.groupBy(reports, labelsFn);
            var empty = labels.map(function(l) { return null; });

            var series = utilitiesService.groupBy(reports, seriesFn);

            series.forEach(function(serie, index) {
                chart.series.push(serie.key);
                chart.data.push(empty.slice());
            });

            labels.forEach(function(label, index) {
                chart.labels.push(label.key);

                label.items.forEach(function(report, index) {
                    var s = chart.series.indexOf(seriesFn(report));
                    var l = chart.labels.indexOf(labelsFn(report));
                    chart.data[s][l] = dataFn(report);
                });
            });

            //add total series
            chart.series.push("Σύνολο");
            var zeroes = labels.map(function(l) { return 0; });
            chart.data.push(zeroes);

            chart.labels.forEach(function (label, index) {
                var total = 0;
                for (var i = 0; i < chart.series.length; i++) {
                    total += chart.data[i][index];
                }
                chart.data[chart.series.length-1][index] = total;
            });

            $scope.charts[reports[0].Type] = chart;

            return chart;
        }

        // old, more generic code (DONT DELETE IT)
        function generateDataForSitReps(reports, dateFormat) {
            if (reports == null) { return; }

            var labelsFn = function(report) { return utilitiesService.formatDateTime(report.DateTime, dateFormat); }
            var seriesFn = function(report) { return report.Facility.Name; }
            var dataFn = function(report) { return report.PersonCount; }

            return generateReportStats(reports, labelsFn, seriesFn, dataFn);
        }
    });
