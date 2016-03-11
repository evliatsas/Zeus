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
	    	    DELETE: 'Διαγραφή Προμηθευτή',
	    	    SAVE: 'Αποθήκευση Προμηθευτή'
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
	    	    UTILIZATION: 'Πληρότητα: ',
	    	    TRANSITION: 'Μετάβαση',
	    	    SAVE: 'Αποθήκευση: ',
	    	    MOVE: 'Μετακίνηση'
	    	},
	    	LOOKUPMODAL: {
	    	    CANCEL: 'ΑΚΥΡΩΣΗ: ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	}
	    };

	    var enUS = {};

    	$translateProvider
	    	.translations('en', enUS)
	        .translations('el', elGR)
	        .fallbackLanguage('el')
	        .preferredLanguage('el')
	        .useSanitizeValueStrategy('escaped');
	});