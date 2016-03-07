(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('lookupService', lookupService);

    function lookupService() {
        return {
            priorities: [
                { Id: 0, Description: '<i class="text-muted material-icons md-18" title="Χαμηλή">flag</i>' },
                { Id: 1, Description: '<i class="text-success material-icons md-18" title="Κανονική">flag</i>' },
                { Id: 2, Description: '<i class="text-info material-icons md-18" title="Επείγον">flag</i>' },
                { Id: 3, Description: '<i class="text-warning material-icons md-18" title="Άμεσο">flag</i>' },
                { Id: 4, Description: '<i class="text-danger material-icons md-18" title="Αστραπιαίο">flag</i>' },
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
                { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' },
                { Id: 6, Description: '<i class="text-primary material-icons md-18" title="Μήνυμα προς Εγκατάσταση">email</i>' }
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
            housingCategories: [
                'ISOBOX',
                'Σκηνή',
                'Οικία',
                'Ξενοδοχείο',
                'Ανοικτός Χώρος'
            ],
            administrations: [
                'Υπ. Εσωτερικών',
                'Περιφέρεια',
                'ΜΚΟ',
                'ΓΕΕΘΑ'
            ],
            relationships: [
                { Id: 0, Description: 'Άνδρας' },
                { Id: 1, Description: 'Γυναίκα' },
                { Id: 2, Description: 'Πατέρας' },
                { Id: 3, Description: 'Μητέρα' },
                { Id: 4, Description: 'Παιδί' },
                { Id: 5, Description: 'Αδερφός' },
                { Id: 6, Description: 'Αδερφή' },
                { Id: 7, Description: 'Πεθερός' },
                { Id: 8, Description: 'Πεθερά' }
            ],
            movementTypes: [
                'Είσοδος',
                'Έξοδος',
                'Επιστροφή',
                'Εθελούσια',
                'Απέλαση',
                'Άφιξη',
                'Μετεγκατάσταση'
            ],
            transportation: [
                'Λεωφορείο',
                'Ι.Χ.',
                'Πλοίο',
                'Αεροπλάνο'
            ]
        };
    }
})();