'use strict';

angular
	.module('zeusclientApp')
    .config(function ($translateProvider) {

    	var elGR = {
	    	MENU: {
	    		BRAND: 'ξ ε ν ί α',
	    		FACILITIES: 'Δομές Φιλοξενίας',
	    		CONTACTS: 'Επαφές',
	    		PROVIDERS: 'Υποστήριξη',
	    		PERSONS: 'Ταυτοποιημένοι',
	    		MAP: 'Χάρτης',
	    		CHARTS: 'Στατιστικά',
	    		USERS: 'Χρήστες',
	    		ARCHIVES: 'Αρχείο',
	    		SUPPORT: {
	    			HELP: 'Βοήθεια',
	    			ABOUT: 'Για την Εφαρμογή'
	    		},
	    		USER: {
	    			SIGN_IN: 'Σύνδεση',
	    			CHANGE_PASSWORD: 'Αλλαγή Κωδικού',
	    			MESSAGES: 'Μηνύματα',
	    			SIGN_OUT: 'Αποσύνδεση'
	    		}
	    	},
	    	FACILITY: {
	    	    DELETE: 'Διαγραφή Δομής Φιλοξενίας',
	    	    SAVE: 'Αποθήκευση Δομής Φιλοξενίας',
	    	    HOUSING: 'Στέγαση',
	    	    CONTACTS: 'Επαφές',
	    	    PROVIDERS: 'Υποστήριξη',
	    	    REPORTS: 'Αναφορές',
	    	    PERSONS: 'Ταυτοποιημένοι'
	    	},
	    	FACILITYDETAILS: {
	    	    NAME: 'Δομή Φιλοξενίας: ',
	    	    DESCRIPTION:'Περιγραφή',
	    	    TYPE: 'Κατηγορία',
	    	    CAPACITY: 'Χωρητικότητα',
	    	    ATTENDANCE: 'Φιλοξενούμενοι: ',
	    	    ISSECURE: 'Φυλασσόμενος Χώρος',
	    	    HASHEALTHCARE: 'Υγεινομική Υποστήριξη',
	    	    STATUS: 'Κατάσταση',
	    	    ADMINISTRATION: 'Διαχειριστής',
	    	    NOTES: 'Κείμενο',
	    	    STATUSDATETIME: 'Ημερομηνία Κατάστασης',
	    	    STATUSECT: 'Εκτιμώμενη Ημερομηνία Αποκατάστασης'
	    	},
	    	FACILITYCARD: {
	    	    GUESTS: 'Φιλοξενούμενοι: ',
	    	    REPORTS: 'Αναφορές: ',
	    	    IDENTIFIED: 'Ταυτοποιημένοι: ',
	    	    APPLICATION: 'Αίτηση',
	    	    HOUSING: 'Στέγαση: ',
	    	    TRANSPORT: 'Μετακίνηση',
	    	    SITUATION: 'Κατάσταση',
	    	    PROBLEM: 'Πρόβλημα',
	    	    MESSAGE: 'Μήνυμα'
	    	},
	    	FACILITYMAP: {
	    	    GUESTS: 'Φιλοξενούμενοι: ',
	    	    CAPACITY: 'Χωρητικότητα',
	    	    UTILIZATION: 'Πληρότητα',
	    	    TRANSITION: 'Μετάβαση',
	    	    SAVE: 'Αποθήκευση: ',
	    	    MOVE: 'Μετακίνηση'
	    	},
	    	LOOKUPMODAL: {
	    	    CANCEL: 'ΑΚΥΡΩΣΗ: ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	},
	    	PHONELIST: {
	    	    PHONES: 'Τηλέφωνα Επικοινωνίας ',
	    	    NUMBER: 'Αριθμός'
	    	},
	    	FEEDINGREPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα ',
	    	    SUBJECT: 'Θέμα',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    PROVIDER: 'Προμηθευτής',
	    	    MEAL: 'Γεύμα',
	    	    RATIONS: 'Μερίδες',
	    	    NOTES: 'Κείμενο'
	    	},
	    	HOUSINGREPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα ',
	    	    SUBJECT: 'Θέμα',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    TYPE: 'Είδος Στέγασης',
	    	    HOUSECOUNT: 'Πλήθος Ατόμων',
	    	    NOTES: 'Κείμενο'
	    	},
	    	REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    NOTARCHIVED: 'Αρχειοθέτηση Αναφοράς: ',
	    	    ARCHIVED: 'Εξαγωγή Αναφοράς από Αρχείο',
	    	    PRIORITY: 'Προτεραιότητα ',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    SUBJECT: 'Θέμα'
	    	},
	    	SITUATIONREPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα: ',
	    	    CHILDREN: 'Πλήθος Παιδιών ',
	    	    SUBJECT: 'Θέμα',
	    	    PERSONCOUNT: 'Πλήθος Ατόμων',
	    	    SENSITIVECOUNT: 'Άτομα Ευαίσθητης Ομάδας ',
	    	    NOTES: 'Κείμενο'
	    	},
	    	TRANSPORTREPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα: ',
	    	    SUBJECT: 'Θέμα',
	    	    STARTINGPOINT: 'Από (Δομή Φιλοξενίας)',
	    	    DESTINATION: 'Πρός',
	    	    MOVEMENTTYPE: 'Είδος Μετακίνησης',
	    	    PERSONCOUNT: 'Πλήθος Ατόμων',
	    	    DEPARTURE: 'Ημ. Αναχώρησης',
	    	    ETA: 'Εκτιμώμενη Ημ. Άφιξης',
	    	    TRANSPORTTYPE: 'Μέσο Μεταφοράς',
	    	    TRANSPORTUID: 'Μοναδικό Αναγνωριστικό',
	    	    ISHIRED: 'Είναι Ναυλωμένο',
	    	    NOTES: 'Κείμενο'
	    	},
	    	ARCHIVE: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    FROM: 'Ημ. Από',
	    	    UNTIL: 'Ημ. Έως',
	    	    SHOWFILE: 'Εμφάνιση Αρχείου'
	    	},
	    	CONTACT: {
	    	    DELETE: 'Διαγραφή Επαφής',
	    	    SAVE: 'Αποθήκευση Επαφής',
	    	    TITLE: 'Τίτλος',
	    	    NAME: 'Όνοματεπώνυμο',
	    	    COMPANY: 'Οργανισμός',
	    	    ADMINISTRATION: 'Διαχείριση',
	    	    TYPE: 'Κατηγορία',
	    	    ADDRESS: 'Διεύθυνση',
	    	    EMAIL: 'Email',
	    	    NOTES: 'Σημειώσεις',
	    	    FACILITIES: 'Δομές Φιλοξενίας',
	    	    PROVIDERS: 'Υποστήριξη'
	    	},
	    	HOUSING: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    EDITHOUSING: 'Επεξεργασία Εγκατάστασης ',
	    	    TYPE: 'Κατηγορία',
	    	    STATUS: 'Κατάσταση: ',
	    	    CAPACITY: 'Χωρητικότητα Μονάδας',
	    	    HOUSINGCOUNT: 'Πλήθος Μονάδων',
	    	    ATTENDANCE: 'Φιλοξενούμενοι',
	    	    CANCEL: 'ΑΚΥΡΩΣΗ: ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	},
	    	LOGIN: {
	    	    USERNAME: 'Όνομα Χρήστη',
	    	    PASSWORD: 'Κωδικός Πρόσβασης',
	    	    SIGNIN: 'ΕΙΣΟΔΟΣ'
	    	},
	    };

	    var enUS = {};

    	$translateProvider
	    	.translations('en', enUS)
	        .translations('el', elGR)
	        .fallbackLanguage('el')
	        .preferredLanguage('el')
	        .useSanitizeValueStrategy('escaped');
	});