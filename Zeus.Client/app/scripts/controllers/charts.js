'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function($scope, $http, $filter, baseUrl, messageService, lookupService) {

        $scope.lookup = lookupService;

        $scope.types = [];
        $scope.facilities = [];
        $scope.reports = [];
        $scope.charts = [];

        var templates = [
            {
                label: "",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            },
            {
                label: "",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }
        ];

        var options = {
            responsive: true,
            animation: true,
            animationSteps: 60,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };

        $http({
            method: 'GET',
            url: baseUrl + '/reports/facilities/stats'
        }).then(function successCallback(response) {
            $scope.reports = response.data;
            $scope.reports.forEach(function (item, index) {
                item.Checked = false;

                var type = $filter('filter')($scope.types, function(c) { return c == item.Type; })[0];
                if (type == null) { $scope.types.push(item.Type); }

                var facility = $filter('filter')($scope.facilities, function(f) { return f.Id == item.Facility.Id; })[0];
                if (facility == null) { $scope.facilities.push(item.Facility); }
            });

            //response.data.forEach(addDataPoints);
            //var ctx = document.getElementById("chart").getContext("2d");
            //var myLineChart = new Chart(ctx).Line(data, options);
            //document.getElementById('legend').innerHTML = myLineChart.generateLegend();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        function format(dt) {
            var format = "D-M-YY HH:mm";
            return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
        }

        function createChart(type) {
            var cn = 'chart' + type;
            var ln = 'legend' + type;
            var element = document.getElementById(cn);
            var context = element.getContext("2d");
            var chart = new Chart(context).Line(templates[0], options);
            document.getElementById(ln).innerHTML = chart.generateLegend();
            return chart;
        }

        function getChart(type) {
            var chart = $filter('filter')($scope.charts, function (c) { return c.Id == type; })[0];

            if (chart == null) {
                chart = createChart(type);
                $scope.charts.push(chart);
            }
            return chart;
        }

        function populateDataSet(reports, pointsField, labelsField) {
            if (reports == null || reports.length == 0) { return; }
            //var chart = getChart(reports[0]);

            var ds = angular.copy(templates[0]);

            ds.label = "Φιλοξενούμενοι";
            reports.forEach(function (report, index) {
                ds.labels.push(report[labelsField]);
                ds.data.push(report[pointsField]);
            });

            return ds;
        }

        $scope.update = function (type, facility) {
            var reports = $filter('filter')($scope.reports, function (r) { return r.Type == type && r.Facility.Id == facility.Id; });

            if (reports != null) {
                var dsr = [];
                reports.forEach(function (report, index) {
                    report.Checked = !report.Checked;
                    if (report.Checked == true) {
                        dsr.push(report);
                    }
                });

                var chart = getChart(type);
                var ds = populateDataSet(dsr);

                //chart.datasets.push(dsr);
                //chart.update();
            }

        }

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $scope.charts = [];
        });

        // function addDataPoints(element, index, array) {
        //     data.labels.push(format(element.DateTime));
        //     data.datasets[0].data.push(element.PersonCount);
        //     checkAndAdd(element.Facility);
        // }

        // function checkAndAdd(facility) {
        //     var id = $scope.facilities.length + 1;
        //     var found = $scope.facilities.some(function(el) {
        //         return el.Name === facility.Name;
        //     });
        //     if (!found) { $scope.facilities.push(facility); }
        // }
    });
