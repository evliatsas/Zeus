'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function($scope, $http, $filter, baseUrl, messageService, lookupService) {

        $scope.lookup = lookupService;

        $scope.stats = [];
        $scope.reports = [];

        var data = {
            labels: [],
            datasets: [{
                label: "Φιλοξενούμενοι",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }]
        };

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
            $scope.stats = response.data;
            organizeReports(response.data);
            //response.data.forEach(addDataPoints);
            //var ctx = document.getElementById("myChart").getContext("2d");
            //var myLineChart = new Chart(ctx).Line(data, options);
            //document.getElementById('myLegend').innerHTML = myLineChart.generateLegend();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        function organizeReports(data) {
            $scope.reports = [];
            if (data == undefined) { return; }
            data.forEach(function(item, array) {
                var category = $filter('filter')($scope.reports, function(c) { return c.Id == item.Type; })[0];

                if (category == null) {
                    category = {
                        Id: item.Type,
                        Name: $scope.lookup.reports[item.Type].Description,
                        Facilities: [],
                        Checked: false
                    };
                    $scope.reports.push(category);
                }

                var facility = $filter('filter')(category.Facilities, function(f) { return f.Id == item.Facility.Id; })[0];

                if (facility == null) {
                    facility = item.Facility;
                    facility.Reports = [];
                    facility.Checked = false;
                    category.Facilities.push(facility);
                }

                var report = {
                    Id: item.Id,
                    Type: category.Type,
                    Name: category.Type,
                    DateTime: item.DateTime,
                    Checked: false
                };

                switch (report.Type) {
                    case 5:
                        report.data = {
                            DateTime: item.DateTime,
                            PersonCount: item.PersonCount
                        };
                        break;
                }
                facility.Reports.push(report);
            });
        }

        function getDataSet(report) {
            switch (report.Type) {
                case 5:
                break;
            }
        }

        function getContext() {
            document.getElementById("reportChart").getContext("2d");
        }

        function drawChart(reports, options) {

            var myLineChart = new Chart(getContext()).Line(data, options);
            document.getElementById('reportLegend').innerHTML = myLineChart.generateLegend();
        }



        function updateCharts() {
            $scope.facilities.forEach(function(element, index) {
                console.log(getReportsForFacility(element.Id));
            });

            var ctx = document.getElementById("myChart").getContext("2d");
            var myLineChart = new Chart(ctx).Line(data, options);
            document.getElementById('myLegend').innerHTML = myLineChart.generateLegend();
        }

        function getReportsForFacility(facilityId) {
            return $filter('filter')($scope.reports, { Id: facilityId });
        }

        function addDataPoints(element, index, array) {
            data.labels.push(format(element.DateTime));
            data.datasets[0].data.push(element.PersonCount);
            checkAndAdd(element.Facility);
        }

        function format(dt) {
            var format = "D-M-YY HH:mm";
            return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
        }

        function checkAndAdd(facility) {
            var id = $scope.facilities.length + 1;
            var found = $scope.facilities.some(function(el) {
                return el.Name === facility.Name;
            });
            if (!found) { $scope.facilities.push(facility); }
        }
    });
