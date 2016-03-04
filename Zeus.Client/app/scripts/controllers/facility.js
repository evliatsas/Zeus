'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
    .controller('FacilityCtrl', function($scope) {
        $.material.init();

        $scope.data = {
            "Id": "ABCD",
            "Name": "Λιμάνι Πειραιά",
            "Type": "Λιμάνι",
            "Description": "Χώρος προσωρινής φιλοξενίας στο λιμάνι του Πειραιά",
            "Capacity": 200,
            "Attendance": 300,
            "Utilization": 150,
            "Status": "Ενεργό"
        };

        $scope.categories = ['Χώρος Φιλοξενίας', 'Οικισμός', 'Ανοικτός Χώρος', 'Στρατιωτικός Χώρος', 'Κινητή Μονάδα', 'Ξενοδοχείο', 'Δημόσιο Κτίριο'];
        $scope.statuses = ['Σε Λειτουργία', 'Υπο Επισκευή', 'Υπο Κατασκευή', 'Κατεστραμένο', 'Ανενεργό'];
        $scope.administrations = ['Υπ. Εσωτερικών', 'Περιφέρεια', 'ΜΚΟ', 'ΓΕΕΘΑ'];

        $scope.dateformat = 'd/M/yy';
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.datePicker1 = {
            opened: false
        };
        $scope.openDatePicker = function($event, index) {
            $scope.datePicker1.opened = true;
        }

    });
