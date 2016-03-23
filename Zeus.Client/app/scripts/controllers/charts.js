'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function ($scope, $http, $filter, baseUrl, utilitiesService, messageService) {

        $scope.facilities = [];
        $scope.util = utilitiesService;
        $scope.charts =null;

        $scope.from = moment().subtract(7, 'days').startOf('day');
        $scope.to = moment();

        // Chart.defaults.global.colours = [
        //     '#97BBCD', // blue
        //     '#DCDCDC', // light grey
        //     '#F7464A', // red
        //     '#46BFBD', // green
        //     '#FDB45C', // yellow
        //     '#949FB1', // grey
        //     '#4D5360'  // dark grey
        // ];

        $scope.getStats = function (type, from, to) {
            var query = {
                types: [5], //only getting SituationReports for now
                from: $scope.from,
                to: $scope.to
            };
            $http({
                method: 'POST',
                data: query,
                url: baseUrl + '/reports/facilities/stats'
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

        function populateCharts(reports, dateFormat) {
            $scope.facilities = [];
            $scope.charts = {};

            if (reports == null || reports.length == 0) {
                return;
            }

            $scope.charts.total = newChart(null, ['Φιλοξενούμενοι']);
            $scope.charts.special = newChart(null, ['Παιδιά', 'Ευαίσθητες Ομάδες']);

            var byFacility = utilitiesService.groupBy(reports, function (report) { return report.Facility.Name; });
            byFacility.forEach(function (facilityGroup, facilityIndex) {
                var facility = facilityGroup.items[0].Facility;
                $scope.facilities.push(facility);

                var chart = newChart(null, ['Χωρητικότητα', 'Μέγιστη Χωρητικότητα', 'Φιλοξενούμενοι']);
                $scope.charts[facility.Id] = chart;

                var byDate = utilitiesService.groupBy(facilityGroup.items, function(report) { return utilitiesService.formatDateTime(report.DateTime, dateFormat); });
                byDate.forEach(function (dateGroup, index) {
                    chart.labels.push(dateGroup.key);

                    var inTotal = $filter('filter')($scope.charts.total.labels, function (l) { return l == dateGroup.key; }).length > 0;
                    if (!inTotal) {
                        $scope.charts.total.labels.push(dateGroup.key);
                        $scope.charts.total.data[0].push(0);
                    }

                    var inSpecial = $filter('filter')($scope.charts.special.labels, function (l) { return l == dateGroup.key; }).length > 0;
                    if (!inSpecial) {
                        $scope.charts.special.labels.push(dateGroup.key);
                        $scope.charts.special.data[0].push(0);
                        $scope.charts.special.data[1].push(0);
                    }
                    
                    var desc = dateGroup.items.sort(function (a,b) { return a.DateTime - b.DateTime; });
                    chart.data[0].push(facility.MaxCapacity);
                    chart.data[1].push(facility.Capacity);
                    chart.data[2].push(desc[0].PersonCount);

                    var labelIndex = $scope.charts.total.labels.indexOf(dateGroup.key);
                    $scope.charts.total.data[0][labelIndex] += desc[0].PersonCount;
                    $scope.charts.special.data[0][labelIndex] += desc[0].Children;
                    $scope.charts.special.data[1][labelIndex] += desc[0].SensitiveCount;
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
