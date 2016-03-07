(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('lookupService', lookupService);

    function lookupService() {
        return {
            priorities: [
                { Id: 0, Description: '<i class="fa fa-flag text-muted" title="Χαμηλή">' },
                { Id: 1, Description: '<i class="fa fa-flag text-success" title="Κανονική">' },
                { Id: 2, Description: '<i class="fa fa-flag text-info" title="Επείγον">' },
                { Id: 3, Description: '<i class="fa fa-flag text-warning" title="Άμεσο">' },
                { Id: 4, Description: '<i class="fa fa-flag text-danger" title="Αστραπιαίο">' },
            ],
            classifications: [
                { Id: 0, Description: '<i class="fa fa-square text-muted" title="Αδιαβάθμητο (ΑΔ)">' },
                { Id: 1, Description: '<i class="fa fa-square text-success" title="Περιορισμένης Χρήσης (ΠΧ)">' },
                { Id: 2, Description: '<i class="fa fa-square text-warning" title="Εμπιστευτικό (ΕΠ)">' },
                { Id: 3, Description: '<i class="fa fa-square text-danger" title="Απόρρητο (ΑΠ)">' }
            ],
            reportTypes: [
                { Id: 0, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Σίτισης">restaurant_menu</i>' },
                { Id: 1, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Στέγασης">local_hotel</i>' },
                { Id: 2, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Μετακίνησης">airport_shuttle</i>' },
                { Id: 3, Description: '<i class="text-danger material-icons md-18" title="Αναφορά Προβλήματος">error</i>' },
                { Id: 4, Description: '<i class="text-warning material-icons md-18" title="Αναφορά Αίτησης">message</i>' },
                { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' }
            ],
            htmlStatus: [
                { Id: 0, Description: '<i class="text-success material-icons md-18" title="Σε Λειτουργία">fiber_manual_record</i>' },
                { Id: 1, Description: '<i class="text-warning material-icons md-18" title="Υπο Επισκευή">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-info material-icons md-18" title="Υπο Κατασκευή">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-muted material-icons md-18" title="Κατεστραμένο">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-danger material-icons md-18" title="Ανενεργό">fiber_manual_record</i>' }
            ],
            statuses: [
                'Σε Λειτουργία',
                'Υπο Επισκευή',
                'Υπο Κατασκευή',
                'Κατεστραμένο',
                'Ανενεργό'
            ],
            facilityCategories: [
                'Χώρος Φιλοξενίας',
                'Οικισμός',
                'Ανοικτός Χώρος',
                'Στρατιωτικός Χώρος',
                'Κινητή Μονάδα',
                'Ξενοδοχείο',
                'Δημόσιο Κτίριο'
            ],
            administrations: [
                'Υπ. Εσωτερικών',
                'Περιφέρεια',
                'ΜΚΟ',
                'ΓΕΕΘΑ'
            ]
        };
    }
})();