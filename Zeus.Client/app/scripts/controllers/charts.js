'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function ($scope, $http, $filter, baseUrl, messageService, lookupService) {

        $scope.lookup = lookupService;

        $scope.facilities = [];
        $scope.charts = {};

        $scope.from = moment().subtract(7, 'days');
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
                populateCharts(response.data);
            }, function errorCallback(response) {
                messageService.showError(response.message);
            });
        }

        $scope.getType = function (type) {
            return $filter('filter')($scope.lookup.reports, function (r) { return r.Id == type; })[0].Description;
        }

        function format(dt, format) {
            var format = format || "DD-MM";
            return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
        }

        function groupBy(items, groupBy) {
            var groups = [];
            if (items == null) { return groups; }

            items.forEach(function(item, index) {

                var key = typeof groupBy === "function" ? groupBy(item) : item[groupBy];

                var group = $filter('filter')(groups, function(g) {
                    return g.key == key; })[0];

                if (group == null) {
                    group = {
                        key: key,
                        items: []
                    };
                    groups.push(group);
                }
                group.items.push(item);
            });

            groups.sort();

            return groups;
        }

        function newChart() {
            var chart = {
                labels: [],
                series: [],
                data: []
            };
            return chart;
        }

        function populateCharts(reports, dateFormat) {
            $scope.facilities = [];
            $scope.charts = {};

            if (reports == null || reports.length == 0) {
                return;
            }

            var byFacility = groupBy(reports, function (report) { return report.Facility.Name; });
            byFacility.forEach(function (facilityGroup, index) {
                $scope.facilities.push(facility.key);

                var chart = new Chart();

                var byDate = groupBy(facilityGroup.items, function(report) { return format(report.DateTime, dateFormat); });
                byDate.forEach(function (dateGroup, index) {
                    
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

            var labels = groupBy(reports, labelsFn);
            var empty = labels.map(function(l) { return null; });

            var series = groupBy(reports, seriesFn);

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

            var labelsFn = function(report) { return format(report.DateTime, dateFormat); }
            var seriesFn = function(report) { return report.Facility.Name; }
            var dataFn = function(report) { return report.PersonCount; }

            return generateReportStats(reports, labelsFn, seriesFn, dataFn);
        }
    });
