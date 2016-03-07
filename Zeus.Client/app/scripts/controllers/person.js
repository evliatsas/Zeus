'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonCtrl', function ($scope, lookupService) {

        $scope.data = {
            "Name" : "Tasos",
        }

        $scope.facilities = [{
            "Id": "",
            "Name": ""
        },
            {
            "Id": "ABCD",
            "Name": "Λιμάνι Πειραιά",
            "Type": "Λιμάνι",
            "Description": "Χώρος προσωρινής φιλοξενίας στο λιμάνι του Πειραιά",
            "Capacity": 200,
            "Attendance": 300,
            "Utilization": 150,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Σπίτι Κανελλόπουλου",
            "Type": "Ιδιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο σπίτι του CEO της Cinnamon Software House",
            "Capacity": 100,
            "Attendance": 75,
            "Utilization": 75,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }, {
            "Name": "Στρατόπεδο Παπάγου",
            "Type": "Στρατιωτικός Χώρος",
            "Description": "Χώρος προσωρινής φιλοξενίας στο Πεντάγωνο",
            "Capacity": 100,
            "Attendance": 50,
            "Utilization": 25,
            "Status": "Ενεργό"
        }];
    });
