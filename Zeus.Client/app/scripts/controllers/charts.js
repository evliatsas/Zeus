'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function ($scope, $http, $filter, baseUrl, messageService, lookupService) {

        $scope.lookup = lookupService;

        $scope.types = [];
        $scope.facilities = [];
        $scope.reports = [];
        $scope.charts = [];

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
                $scope.reports = response.data;
                $scope.reports.forEach(function (item, index) {
                    item.Checked = false;

                    var type = $filter('filter')($scope.types, function (c) { return c == item.Type; })[0];
                    if (type == null) { $scope.types.push(item.Type); }

                    var facility = $filter('filter')($scope.facilities, function (f) { return f.Id == item.Facility.Id; })[0];
                    if (facility == null) {
                        $scope.facilities.push(item.Facility);
                        $scope.facilities[$scope.facilities.length - 1].Checked = true;
                    }
                });
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.getType = function (type) {
            return $filter('filter')($scope.lookup.reports, function (r) { return r.Id == type; })[0].Description;
        }

        var notReady = true;
        var filtered = [];

        $scope.update = function (type, facility) {
            if (notReady == true) { return; }
            filtered = [];
            $scope.reports.forEach(function (report, index) {
                var facility = $filter('filter')($scope.facilities, function (f) { return f.Name == report.Facility.Name; })[0];
                if (facility != null && facility.Checked == true) {
                    filtered.push(report);
                }
            });
            generateDataForSitReps(filtered, "DD-MM");
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
                var row = empty.slice();
                chart.data.push(row);
            });

            labels.forEach(function(label, index) {
                chart.labels.push(label.key);

                label.items.forEach(function(report, index) {
                    var s = chart.series.indexOf(seriesFn(report));
                    var l = chart.labels.indexOf(labelsFn(report));
                    chart.data[s][l] = dataFn(report);
                });
            });

            $scope.charts[reports[0].Type] = chart;

            return chart;
        }

        function generateDataForSitReps(reports, dateFormat) {
            if (reports == null) { return; }

            var labelsFn = function(report) { return format(report.DateTime, dateFormat); }
            var seriesFn = function(report) { return report.Facility.Name; }
            var dataFn = function(report) { return report.PersonCount; }

            return generateReportStats(reports, labelsFn, seriesFn, dataFn);
        }

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            notReady = false;
            generateDataForSitReps($scope.reports, "DD-MM");
        });
    });
