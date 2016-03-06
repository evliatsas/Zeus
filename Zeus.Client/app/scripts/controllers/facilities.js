'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope) {

        $scope.addFacility = function () {
            alert('add facility');
        }
        
        this.list = [{
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
