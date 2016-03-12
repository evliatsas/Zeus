'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function($scope, $http, $filter, baseUrl, messageService, lookupService) {

        $scope.lookup = lookupService;

        $scope.types = [];
        $scope.facilities = [];
        $scope.reports = [];
        $scope.charts = [];

        $http({
            method: 'GET',
            url: baseUrl + '/reports/facilities/stats'
        }).then(function successCallback(response) {
            $scope.reports = response.data;
            $scope.reports.forEach(function(item, index) {
                item.Checked = false;

                var type = $filter('filter')($scope.types, function(c) { return c == item.Type; })[0];
                if (type == null) { $scope.types.push(item.Type); }

                var facility = $filter('filter')($scope.facilities, function(f) { return f.Id == item.Facility.Id; })[0];
                if (facility == null) { $scope.facilities.push(item.Facility); }

                generateDataForSitReps($scope.reports);
            });

        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.getType = function(type) {
            return $filter('filter')($scope.lookup.reports, function(r) { return r.Id == type; })[0].Description;
        }

        function format(dt, format) {
            var format = format || "D-M";
            return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
        }

        function groupByDate(items, dateField, dateFormat) {
            var groups = [];
            if (items == null) { return groups; }

            items.forEach(function (item, index) {
                var key = format(item[dateField], dateFormat);

                var group = $filter('filter')(groups, function (g) { return g.key == key; })[0];

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

        function generateReportStats(reports, seriesField, dataField) {
            if (reports == null) { return; }

            var chart = {
                labels: [],
                series: [],
                data: [],
                onClick: function(points, evt) { console.log(points, evt); }
            };

        }

        function generateDataForSitReps(reports, dateFormat) {
            if (reports == null) { return; }
            var chart = {
                labels: [],
                series: [],
                data: [],
                onClick: function(points, evt) { console.log(points, evt); }
            };

            var groups = groupByDate(reports, "DateTime");

            groups.forEach(function (group, index) {
                chart.labels.push(group.key);

                group.items.forEach(function (report, index) {
                    var fi = chart.series.indexOf(report.Facility.Name);
                    if (fi < 0) {
                        chart.series.push(report.Facility.Name);
                        chart.data.push([]);
                        fi = chart.series.indexOf(report.Facility.Name);
                    }
                    chart.data[fi].push(report.PersonCount);
                });
            });

            $scope.charts[reports[0].Type] = chart;

            return chart;
        }

        // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //     $scope.charts = [];
        // });
    });
