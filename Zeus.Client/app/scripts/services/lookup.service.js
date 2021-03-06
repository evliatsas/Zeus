﻿(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('lookupService', lookupService);

    function lookupService() {
        return {
            priorities: [
                { Id: 0, Description: '<i class="text-muted material-icons" title="Χαμηλή">flag</i>' },
                { Id: 1, Description: '<i class="text-success material-icons" title="Κανονική">flag</i>' },
                { Id: 2, Description: '<i class="text-info material-icons" title="Επείγον">flag</i>' },
                { Id: 3, Description: '<i class="text-warning material-icons" title="Άμεσο">flag</i>' },
                { Id: 4, Description: '<i class="text-danger material-icons" title="Αστραπιαίο">flag</i>' },
            ],
            prioritiesTitles: [
                { Id: 0, Description: 'Χαμηλή' },
                { Id: 1, Description: 'Κανονική' },
                { Id: 2, Description:'Επείγον' },
                { Id: 3, Description: 'Άμεσο' },
                { Id: 4, Description: 'Αστραπιαίο' },
            ],
            classifications: [
                { Id: 0, Description: '<i class="fa fa-square text-muted" title="Αδιαβάθμητο (ΑΔ)">' },
                { Id: 1, Description: '<i class="fa fa-square text-success" title="Περιορισμένης Χρήσης (ΠΧ)">' },
                { Id: 2, Description: '<i class="fa fa-square text-warning" title="Εμπιστευτικό (ΕΠ)">' },
                { Id: 3, Description: '<i class="fa fa-square text-danger" title="Απόρρητο (ΑΠ)">' }
            ],
            recipientTypes:[
                { Id: 0, Description: 'Δομή Φιλοξενίας' },
                { Id: 1, Description: 'Φορέα Υποστήριξης' },
                { Id: 2, Description: 'Επαφή' }
            ],
            reports: [
                { Id: 5, Description: 'Τρέχουσας Κατάστασης' },
                { Id: 7, Description: 'Υγειονομική Αναφορά' },
                { Id: 0, Description: 'Αναφορά Σίτισης' },                
                { Id: 1, Description: 'Αναφορά Στέγασης' },
                { Id: 2, Description: 'Αναφορά Μετακίνησης' },
                { Id: 3, Description: 'Αναφορά Προβλημάτων' },
                { Id: 4, Description: 'Αίτησης-Ελλείψεων' },                
                { Id: 6, Description: 'Οδηγίες-Μηνύματα' }
            ],
            reportCategories: [
                { Id: 0, Description: 'Ανθρωπιστικής Βοήθειας' },
                { Id: 1, Description: 'Υγειονομικού Ενδιαφέροντος' },
                { Id: 2, Description: 'Εξοπλισμού Εγκαταστάσεων' },
                { Id: 3, Description: 'Λειτουργίας' }
            ],
            reportTitles: [               
                { Id: 0, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Σίτισης">restaurant_menu </i><div class="report-header">Αναφορά Σίτισης</div>' },
                { Id: 1, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Στέγασης">local_hotel </i><div class="report-header">Αναφορά Στέγασης</div>' },
                { Id: 2, Description: '<i class="text-primary material-icons md-48 pull-left" title="Αναφορά Μετακίνησης">airport_shuttle </i><div class="report-header">Αναφορά Μετακίνησης</div>' },
                { Id: 3, Description: '<i class="text-danger material-icons md-48 pull-left" title="Αναφορά Προβλήματος">error </i><div class="report-header"><span>Αναφορά Προβλήματος</div>' },
                { Id: 4, Description: '<i class="text-warning material-icons md-48 pull-left" title="Αίτηση">message </i><div class="report-header">Αίτηση</div>' },
                { Id: 5, Description: '<i class="text-info material-icons md-48 pull-left" title="Αναφορά Κατάστασης">assignment </i><div class="report-header">Αναφορά Κατάστασης</div>' },               
                { Id: 6, Description: '<i class="text-primary material-icons md-48 pull-left" title="Μήνυμα">email </i><div class="report-header">Οδηγία</div>' },
                { Id: 7, Description: '<i class="text-warning material-icons md-48 pull-left" title="Υγειονομική Αναφορά">local_hospital</i><div class="report-header">Υγειονομική Αναφορά</div>' },
            ],
            reportTypesHtml: [
                { Id: 0, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Σίτισης">restaurant_menu</i>' },
                { Id: 1, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Στέγασης">local_hotel</i>' },
                { Id: 2, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Μετακίνησης">airport_shuttle</i>' },
                { Id: 3, Description: '<i class="text-danger material-icons md-18" title="Αναφορά Προβλήματος">error</i>' },
                { Id: 4, Description: '<i class="text-warning material-icons md-18" title="Αίτηση">message</i>' },
                { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' },
                { Id: 6, Description: '<i class="text-primary material-icons md-18" title="Οδηγία">email</i>' },
                { Id: 7, Description: '<i class="text-warning material-icons md-18" title="Υγειονομική Αναφορά">local_hospital</i>'}
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
            facilityAreas: [
                'ΛΕΣΒΟΣ',
                'ΣΑΜΟΣ',
                'ΧΙΟΣ',
                'ΛΕΡΟΣ',
                'ΚΩΣ',
                'ΚΙΛΚΙΣ'
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
            operationCarriers: [
                'ΕΛΑΣ',
                'Λιμενικό',
                'ΜΚΟ',
                'ΜΠ (Διερμηνέας)',
                'Υπ. Πρώτης Υποδοχής',
                'Ύπατη Αρμοστία',
                'Υπ. Μεταφορών'
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
            nationalities: [
                'Μικτή',
                'Συρία',
                'Ιράκ',
                'Αφγανιστάν',                
                'Ιράν',
                'Μαρόκο',                
                'Πακιστάν',
                'Ερυθραία',
                'Λίβανος'
            ],
            sensitivities: [
                "Ασυνόδευτοι Ανήλικοι",
                "Μονογονεϊκές",
                "Εγκυμονούσες",
                "Υπερήλικες",
                "Αναπηρίες"
            ],
            procedures:[
                "Ενημέρωση (UNHCR)",
                "Εθελοντική Επιστροφή (IOM)",
                "Επανατοποθέτηση (Relocation)",
                "Αιτήσεις Ασύλου"
            ],
            providerTypes: [
                { Id: 0, Description: 'Υγειονομική Υποστήριξη' },
                { Id: 1, Description: 'Υγιεινή και Καθαριότητα' },
                { Id: 2, Description: 'Φύλαξη' },
                { Id: 3, Description: 'Τροφοδοσία' },
                { id: 4, Description: 'Διερμηνείς' },
                { id: 5, Description: 'Μετακίνηση Προσωπικού' }
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
            ],
            roles: [
                "Administrator",
                "User",
                "Viewer"
            ],
            claimTypes: [
                "Facility",
                "Provider"
            ]
        };
    }
})();