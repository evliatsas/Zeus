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
            prioritiesTitles: [
                { Id: 0, Description: 'Χαμηλή' },
                { Id: 1, Description: 'Κανονική' },
                 { Id: 3, Description: 'Άμεσο' },
                { Id: 4, Description: 'Αστραπιαίο' },
            ],
            classifications: [
                { Id: 0, Description: '<i class="fa fa-square text-muted" title="Αδιαβάθμητο (ΑΔ)">' },
                { Id: 1, Description: '<i class="fa fa-square text-success" title="Περιορισμένης Χρήσης (ΠΧ)">' },
                { Id: 2, Description: '<i class="fa fa-square text-warning" title="Εμπιστευτικό (ΕΠ)">' },
                { Id: 3, Description: '<i class="fa fa-square text-danger" title="Απόρρητο (ΑΠ)">' }
            ],
            reports: [
                { Id: 0, Description: 'Αναφορά Σίτισης' },
                { Id: 1, Description: 'Αναφορά Στέγασης' },
                { Id: 2, Description: 'Αναφορά Μετακίνησης' },
                { Id: 3, Description: 'Αναφορά Προβλήματος' },
                { Id: 4, Description: 'Αναφορά Αίτησης' },
                { Id: 5, Description: 'Αναφορά Κατάστασης' },
                { Id: 6, Description: 'Μήνυμα' }
            ],
            reportTitles: [
                { Id: 0, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Σίτισης">restaurant_menu </i><div class="report-header">Αναφορά Σίτισης</div>' },
                { Id: 1, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Στέγασης">local_hotel </i><div class="report-header">Αναφορά Στέγασης</div>' },
                { Id: 2, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Μετακίνησης">airport_shuttle </i><div class="report-header">Αναφορά Μετακίνησης</div>' },
                { Id: 3, Description: '<i class="text-danger material-icons md-48 pull-left" title="Αναφορά Προβλήματος">error </i><div class="report-header"><span>Αναφορά Προβλήματος</div>' },
                { Id: 4, Description: '<i class="text-warning material-icons md-48 pull-left" title="Αναφορά Αίτησης">message </i><div class="report-header">Αναφορά Αίτησης</div>' },
                { Id: 5, Description: '<i class="text-info material-icons md-48 pull-left" title="Αναφορά Κατάστασης">assignment </i><div class="report-header">Αναφορά Κατάστασης</div>' },
                { Id: 6, Description: '<i class="text-primary material-icons md-48 pull-left" title="Μήνυμα">email </i><div class="report-header">Μήνυμα</div>' }
            ],
            reportTypesHtml: [
                { Id: 0, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Σίτισης">restaurant_menu</i>' },
                { Id: 1, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Στέγασης">local_hotel</i>' },
                { Id: 2, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Μετακίνησης">airport_shuttle</i>' },
                { Id: 3, Description: '<i class="text-danger material-icons md-18" title="Αναφορά Προβλήματος">error</i>' },
                { Id: 4, Description: '<i class="text-warning material-icons md-18" title="Αναφορά Αίτησης">message</i>' },
                { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' },
                { Id: 6, Description: '<i class="text-primary material-icons md-18" title="Μήνυμα">email</i>' }
            ],
            entryLevelsHtml: [
                { Id: 'Information', Description: '<i class="text-info material-icons md-18">info</i>Information' },
                { Id: 'Error', Description: '<i class="text-danger material-icons md-18">error</i>Error' },
                { Id: 'Warning', Description: '<i class="text-warning material-icons md-18">Deletion</i>' }
            ],
            htmlStatus: [
                { Id: 0, Description: '<i class="text-success material-icons md-18" title="Σε Λειτουργία">fiber_manual_record</i>' },
                { Id: 1, Description: '<i class="text-warning material-icons md-18" title="Υπο Επισκευή">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-info material-icons md-18" title="Υπο Κατασκευή">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-muted material-icons md-18" title="Κατεστραμένο">fiber_manual_record</i>' },
                { Id: 2, Description: '<i class="text-danger material-icons md-18" title="Ανενεργό">fiber_manual_record</i>' }
            ],
            operationTypes: [
                { Id: 0, Description: 'Μεταφορά' },
                { Id: 1, Description: 'Επανατοποθέτηση' },
                { Id: 2, Description: 'Έξοδος' }
            ],
            statuses: [
                'Σε Λειτουργία',
                'Υπο Επισκευή',
                'Υπο Κατασκευή',
                'Κατεστραμένο',
                'Ανενεργό'
            ],
            facilityTypes: [
                'Χώρος Φιλοξενίας',
                'Οικισμός',
                'Ανοικτός Χώρος',
                'Στρατιωτικός Χώρος',
                'Κινητή Μονάδα',
                'Ξενοδοχείο',
                'Δημόσιο Κτίριο'
            ],
            facilityCategories: [
                'ΝΗΣΙΑ',
                'ΑΤΤΙΚΗ',
                'ΚΕΝΤΡΙΚΗ ΕΛΛΑΔΑ',
                'ΒΟΡΕΙΑ ΕΛΛΑΔΑ'
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
            providerTypes: [
                { Id: 0, Description: 'Υγειονομική Υποστήριξη' },
                { Id: 1, Description: 'Εφοδιασμός' },
                { Id: 2, Description: 'Φύλαξη' },
                { Id: 3, Description: 'Τροφοδοσία' }
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
            contactTypes: [
               'Υπεύθυνος',
               'Υπάλληλος',
               'POC',
               'Διαχειριστής',
               'Ιδιοκτήτης'
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