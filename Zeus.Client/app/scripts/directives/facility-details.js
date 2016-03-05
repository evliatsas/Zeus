'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
.directive('facilityDetails', function () {
    return {
        scope: {
            facility: '='
        },
        templateUrl: '/templates/facility-details.html',
        link: function postLink(scope, element, attrs) {
            scope.categories = ['Χώρος Φιλοξενίας', 'Οικισμός', 'Ανοικτός Χώρος', 'Στρατιωτικός Χώρος', 'Κινητή Μονάδα', 'Ξενοδοχείο', 'Δημόσιο Κτίριο'];
            scope.statuses = ['Σε Λειτουργία', 'Υπο Επισκευή', 'Υπο Κατασκευή', 'Κατεστραμένο', 'Ανενεργό'];
            scope.administrations = ['Υπ. Εσωτερικών', 'Περιφέρεια', 'ΜΚΟ', 'ΓΕΕΘΑ'];

            scope.dateformat = 'd/M/yy';
            scope.hstep = 1;
            scope.mstep = 15;
            scope.datePicker1 = {
                opened: false
            };
            scope.datePicker2 = {
                opened: false
            };
            scope.openDatePicker = function ($event, index) {
                if (index == 1)
                    scope.datePicker1.opened = true;
                else
                    scope.datePicker2.opened = true;
            }
        }
    };
});