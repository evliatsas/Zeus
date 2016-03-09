'use strict';

angular
    .module('zeusclientApp')
    .controller('ChartsCtrl', function ($http, baseUrl) {

        var data = {
            labels: [],
            datasets: [               
                {
                    label: "Φιλοξενούμενοι",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }
            ]
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
            response.data.forEach(addDataPoints);
            var ctx = document.getElementById("myChart").getContext("2d");
            var myLineChart = new Chart(ctx).Line(data, options);
            document.getElementById('myLegend').innerHTML = myLineChart.generateLegend();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        function addDataPoints(element, index, array) {
            data.labels.push(format(element.DateTime));
            data.datasets[0].data.push(element.PersonCount);
        }

        function format (dt) {
            var format = "D-M-YY HH:mm";
            return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
        }

    });
