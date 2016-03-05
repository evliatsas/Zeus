'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope) {

        $scope.data = {
            "Id": "ABCD",
            "Name": "Λιμάνι Πειραιά",
            "Type": "Λιμάνι",
            "Description": "Χώρος προσωρινής φιλοξενίας στο λιμάνι του Πειραιά",
            "Capacity": 200,
            "Attendance": 300,
            "Utilization": 150,
            "Status": "Ενεργό",
            "Housings": [
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                }
            ]
        };

    });
