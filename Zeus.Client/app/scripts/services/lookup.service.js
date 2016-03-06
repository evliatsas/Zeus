(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('lookupService', lookupService);

    function lookupService() {
        var service = {
            getPriorities: getPriorities,
            getClassifications: getClassifications,
            getReportTypes: getReportTypes,
            getHtmlStatus: getHtmlStatus,
            getStatus: getStatus,
            getFacilityCategories: getFacilityCategories
        };

        var priorities = [
            { Id: 0, Description: '<i class="fa fa-flag text-muted" title="Χαμηλή">' },
            { Id: 1, Description: '<i class="fa fa-flag text-success" title="Κανονική">' },
            { Id: 2, Description: '<i class="fa fa-flag text-info" title="Επείγον">' },
            { Id: 3, Description: '<i class="fa fa-flag text-warning" title="Άμεσο">' },
            { Id: 4, Description: '<i class="fa fa-flag text-danger" title="Αστραπιαίο">' },
        ];
        var classifications = [
            { Id: 0, Description: '<i class="fa fa-square text-muted" title="Αδιαβάθμητο (ΑΔ)">' },
            { Id: 1, Description: '<i class="fa fa-square text-success" title="Περιορισμένης Χρήσης (ΠΧ)">' },
            { Id: 2, Description: '<i class="fa fa-square text-warning" title="Εμπιστευτικό (ΕΠ)">' },
            { Id: 3, Description: '<i class="fa fa-square text-danger" title="Απόρρητο (ΑΠ)">' }
        ];
        var reporttypes = [
            { Id: 0, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Σίτισης">restaurant_menu</i>' },
            { Id: 1, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Στέγασης">local_hotel</i>' },
            { Id: 2, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Μετακίνησης">airport_shuttle</i>' },
            { Id: 3, Description: '<i class="text-danger material-icons md-18" title="Αναφορά Προβλήματος">error</i>' },
            { Id: 4, Description: '<i class="text-warning material-icons md-18" title="Αναφορά Αίτησης">message</i>' },
            { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' }
        ];
        var htmlStatus = [
            { Id: 0, Description: '<i class="text-success material-icons md-18" title="Σε Λειτουργία">fiber_manual_record</i>' },
            { Id: 1, Description: '<i class="text-warning material-icons md-18" title="Υπο Επισκευή">fiber_manual_record</i>' },
            { Id: 2, Description: '<i class="text-info material-icons md-18" title="Υπο Κατασκευή">fiber_manual_record</i>' },
            { Id: 2, Description: '<i class="text-muted material-icons md-18" title="Κατεστραμένο">fiber_manual_record</i>' },
            { Id: 2, Description: '<i class="text-danger material-icons md-18" title="Ανενεργό">fiber_manual_record</i>' }
        ];
        var status = [
            'Σε Λειτουργία',
            'Υπο Επισκευή',
            'Υπο Κατασκευή',
            'Κατεστραμένο',
            'Ανενεργό'
        ];
        var facilityCategories = [
            'ISOBOX',
            'Σκηνή',
            'Ξενοδοχείο',
            'Οικία',
            'Ανοικτός Χώρος'
        ];

        function getPriorities() {
            return priorities;
        }
        function getClassifications() {
            return classifications;
        }
        function getReportTypes() {
            return reporttypes;
        }
        function getHtmlStatus() {
            return htmlStatus;
        }
        function getStatus() {
            return status;
        }
        function getFacilityCategories() {
            return facilityCategories;
        }

        return service;
    }
})();