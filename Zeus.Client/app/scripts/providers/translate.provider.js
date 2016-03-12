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
	    		PERSONS: 'Ταυτοποιήσεις',
	    		MAP: 'Χάρτης',
	    		CHARTS: 'Στατιστικά',
	    		USERS: 'Χρήστες',
	    		ARCHIVES: 'Αρχείο',
	    		LOG: 'Ενέργειες Χρηστών',
	    		SUPPORT: {
	    			HELP: 'Βοήθεια',
	    			ABOUT: 'Για την Εφαρμογή'
	    		},
	    		USER_MENU: {
	    			SIGN_IN: 'Είσοδος',
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
	    	FACILITY_DETAILS: {
	    	    NAME: 'Δομή Φιλοξενίας: ',
	    	    DESCRIPTION:'Περιγραφή',
	    	    TYPE: 'Κατηγορία',
	    	    CAPACITY: 'Χωρητικότητα',
	    	    ATTENDANCE: 'Φιλοξενούμενοι: ',
	    	    ISSECURE: 'Φυλασσόμενος Χώρος',
	    	    HAS_HEALTHCARE: 'Υγεινομική Υποστήριξη',
	    	    STATUS: 'Κατάσταση',
	    	    ADMINISTRATION: 'Διαχειριστής',
	    	    NOTES: 'Κείμενο',
	    	    STATUS_DATETIME: 'Ημερομηνία Κατάστασης',
	    	    STATUS_ECT: 'Εκτιμώμενη Ημερομηνία Αποκατάστασης'
	    	},
	    	FACILITY_CARD: {
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
	    	FACILITY_MAP: {
	    	    GUESTS: 'Φιλοξενούμενοι: ',
	    	    CAPACITY: 'Χωρητικότητα',
	    	    UTILIZATION: 'Πληρότητα',
	    	    TRANSITION: 'Μετάβαση',
	    	    SAVE: 'Αποθήκευση: ',
	    	    MOVE: 'Μετακίνηση'
	    	},
	    	LOOKUP_MODAL: {
	    	    CANCEL: 'ΑΚΥΡΩΣΗ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	},
	    	PHONE_LIST: {
	    	    PHONES: 'Τηλέφωνα Επικοινωνίας ',
	    	    NUMBER: 'Αριθμός'
	    	},
	    	FEEDING_REPORT: {
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
	    	HOUSING_REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα ',
	    	    SUBJECT: 'Θέμα',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    TYPE: 'Είδος Στέγασης',
	    	    HOUSE_COUNT: 'Πλήθος Ατόμων',
	    	    NOTES: 'Κείμενο'
	    	},
	    	REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    NOT_ARCHIVED: 'Αρχειοθέτηση Αναφοράς: ',
	    	    ARCHIVED: 'Εξαγωγή Αναφοράς από Αρχείο',
	    	    PRIORITY: 'Προτεραιότητα ',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    SUBJECT: 'Θέμα'
	    	},
	    	SITUATION_REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα: ',
	    	    CHILDREN: 'Πλήθος Παιδιών ',
	    	    SUBJECT: 'Θέμα',
	    	    PERSON_COUNT: 'Πλήθος Ατόμων',
	    	    SENSITIVE_COUNT: 'Άτομα Ευαίσθητης Ομάδας ',
	    	    NOTES: 'Κείμενο'
	    	},
	    	TRANSPORT_REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα: ',
	    	    SUBJECT: 'Θέμα',
	    	    STARTING_POINT: 'Από (Δομή Φιλοξενίας)',
	    	    DESTINATION: 'Πρός',
	    	    MOVEMENT_TYPE: 'Είδος Μετακίνησης',
	    	    PERSON_COUNT: 'Πλήθος Ατόμων',
	    	    DEPARTURE: 'Ημ. Αναχώρησης',
	    	    ETA: 'Εκτιμώμενη Ημ. Άφιξης',
	    	    TRANSPORT_TYPE: 'Μέσο Μεταφοράς',
	    	    TRANSPORT_UID: 'Μοναδικό Αναγνωριστικό',
	    	    ISHIRED: 'Είναι Ναυλωμένο',
	    	    NOTES: 'Κείμενο'
	    	},
	    	ARCHIVE: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    FROM: 'Ημ. Από',
	    	    UNTIL: 'Ημ. Έως',
	    	    SHOW_FILE: 'Εμφάνιση Αρχείου'
	    	},
	    	LOG: {
	    	    FROM: 'Ημ. Από',
	    	    UNTIL: 'Ημ. Έως',
	    	    SHOW_FILE: 'Εμφάνιση Εγγραφών'
	    	},
	    	CONTACT: {
	    	    DELETE: 'Διαγραφή Επαφής',
	    	    SAVE: 'Αποθήκευση Επαφής',
	    	    CON:'Επαφή',
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
	    	    DELETE: 'Διαγραφή Εγκατάστασης',
	    	    SAVE: 'Αποθήκευση Εγκατάστασης',
	    	    EDIT_HOUSING: 'Επεξεργασία Εγκατάστασης ',
	    	    TYPE: 'Κατηγορία',
	    	    STATUS: 'Κατάσταση',
	    	    CAPACITY: 'Χωρητικότητα Μονάδας',
	    	    HOUSING_COUNT: 'Πλήθος Μονάδων',
	    	    ATTENDANCE: 'Φιλοξενούμενοι',
	    	    CANCEL: 'ΑΚΥΡΩΣΗ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	},
	    	LOGIN: {
	    	    USERNAME: 'Όνομα Χρήστη',
	    	    PASSWORD: 'Κωδικός Πρόσβασης',
	    	    SIGN_IN: 'ΕΙΣΟΔΟΣ'
	    	},
	    	USER: {
	    	    DELETE: 'Διαγραφή Χρήστη',
	    	    SAVE: 'Αποθήκευση Χρήστη',
	    	    FULLNAME: 'Όνοματεπώνυμο',
	    	    USERNAME: 'Όνομα Χρήστη',
	    	    EMAIL_ERROR: 'To Email δεν είναι έγκυρο',
	    	    PHONENUMBER: 'Τηλέφωνο',
	    	    PASSWORD: 'Κωδικός Πρόσβασης',
	    	    CONFIRM_PASSWORD: 'Επιβεβαίωση Κωδικού',
	    	    CHANGE_PASSWORD: 'ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ: ',
	    	    NEW_PASSWORD: 'Νέος Κωδικός Πρόσβασης'
	    	},
	    	PROVIDER: {
	    	    DELETE: 'Διαγραφή Προμηθευτή',
	    	    SAVE: 'Αποθήκευση Προμηθευτή',
	    	    TITLE: 'Φoρέας Υποστήριξης',
	    	    NAME: 'Όνομασία',
	    	    DESCRIPTION: 'Περιγραφή',
	    	    TYPE: 'Κατηγορία',
	    	    PERSONEL_COUNT: 'Πλήθος Προσωπικού',
	    	    ADMINISTRATION: 'Διαχειριστής',
	    	    SERVICES: 'Προσφερόμενες Υπηρεσίες',
	    	    SERVICE: 'Υπηρεσία'
	    	},
	    	PERSON: {
	    	    DELETE: 'Διαγραφή Ταυτοποιημένου',
	    	    SAVE: 'Αποθήκευση Ταυτοποιημένου',
	    	    TITLE: 'Ταυτοποιημένος',
	    	    NAME: 'Όνομα',
	    	    PASSPORT: 'Διαβατήριο',
	    	    NATIONALITY: 'Εθνικότητα',
	    	    IS_SENSITIVE: 'Ευπαθής',
	    	    SENSITIVITY: 'Ευπάθεια',
	    	    FACILITY: 'Δομή Φιλοξενείας',
	    	    RELATIVES: 'Συγγενείς',
	    	    ADD_RELATIVE: 'ΠΡΟΣΘΗΚΗ ΣΥΓΓΕΝΗ'
	    	}
	    };

	    var enUS = {
	        MENU: {
	            BRAND: 'ξ ε ν ί α',
	            FACILITIES: 'Facilities',
	            CONTACTS: 'Contacts',
	            PROVIDERS: 'Providers',
	            PERSONS: 'Identifications',
	            MAP: 'Map',
	            CHARTS: 'Statistics',
	            USERS: 'Users',
	            ARCHIVES: 'Archive',
                LOG: 'Log Entries',
	            SUPPORT: {
	                HELP: 'Help',
	                ABOUT: 'About'
	            },
	            USER_MENU: {
	                SIGN_IN: 'Sign In',
	                CHANGE_PASSWORD: 'Change Password',
	                MESSAGES: 'Messages',
	                SIGN_OUT: 'Sign Out'
	            }
	        },
	        FACILITY: {
	            DELETE: 'Delete Facility',
	            SAVE: 'Save Facility',
	            HOUSING: 'Housing Facilities',
	            CONTACTS: 'Contacts',
	            PROVIDERS: 'Providers',
	            REPORTS: 'Reports',
	            PERSONS: 'Identified'
	        },
	        FACILITY_DETAILS: {
	            NAME: 'Facility: ',
	            DESCRIPTION: 'Description',
	            TYPE: 'Category',
	            CAPACITY: 'Capacity',
	            ATTENDANCE: 'Attendance: ',
	            ISSECURE: 'Security',
	            HAS_HEALTHCARE: 'Healthcare',
	            STATUS: 'Status',
	            ADMINISTRATION: 'Administration',
	            NOTES: 'Notes',
	            STATUS_DATETIME: 'Status Date',
	            STATUS_ECT: 'Estimated Date of Complition'
	        },
	        FACILITY_CARD: {
	            GUESTS: 'Guests: ',
	            REPORTS: 'Reports: ',
	            IDENTIFIED: 'Identified: ',
	            APPLICATION: 'Application',
	            HOUSING: 'Housing: ',
	            TRANSPORT: 'Transport',
	            SITUATION: 'Situation',
	            PROBLEM: 'Problem',
	            MESSAGE: 'Message'
	        },
	        FACILITY_MAP: {
	            GUESTS: 'Guests: ',
	            CAPACITY: 'Capacity',
	            UTILIZATION: 'Utilization',
	            TRANSITION: 'Transition',
	            SAVE: 'Save: ',
	            MOVE: 'Move'
	        },
	        LOOKUP_MODAL: {
	            CANCEL: 'CANCEL',
	            SELECT: 'SELECT'
	        },
	        PHONE_LIST: {
	            PHONES: 'Phones ',
	            NUMBER: 'Phone Number'
	        },
	        FEEDING_REPORT: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            PRIORITY: 'Priority',
	            SUBJECT: 'Subject',
	            FACILITY: 'Facility',
	            PROVIDER: 'Provider',
	            MEAL: 'Meal',
	            RATIONS: 'Rations',
	            NOTES: 'Notes'
	        },
	        HOUSING_REPORT: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            PRIORITY: 'Priority',
	            SUBJECT: 'Subject',
	            FACILITY: 'Facility',
	            TYPE: 'Category',
	            HOUSE_COUNT: 'Number of Persons',
	            NOTES: 'Notes'
	        },
	        REPORT: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            NOT_ARCHIVED: 'Archive Report',
	            ARCHIVED: 'Export Report from Archive',
	            PRIORITY: 'Priority',
	            FACILITY: 'Facility: ',
	            SUBJECT: 'Subject'
	        },
	        SITUATION_REPORT: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            PRIORITY: 'Priority',
	            CHILDREN: 'Number of Children ',
	            SUBJECT: 'Subject',
	            PERSON_COUNT: 'Number of Persons',
	            SENSITIVE_COUNT: 'Number of Sensitive Persons ',
	            NOTES: 'Notes'
	        },
	        TRANSPORT_REPORT: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            PRIORITY: 'Priority: ',
	            SUBJECT: 'Subject',
	            STARTING_POINT: 'From (Facility)',
	            DESTINATION: 'To (Facility)',
	            MOVEMENT_TYPE: 'Type of Transportation',
	            PERSON_COUNT: 'Number of Persons',
	            DEPARTURE: 'Departure Date',
	            ETA: 'Estimated Time of Arrival',
	            TRANSPORT_TYPE: 'Vehicle',
	            TRANSPORT_UID: 'Unique Identifier',
	            ISHIRED: 'Hired',
	            NOTES: 'Notes'
	        },
	        ARCHIVE: {
	            DELETE: 'Delete Report',
	            SAVE: 'Save Report',
	            FROM: 'From Date',
	            UNTIL: 'To Date',
	            SHOW_FILE: 'Show File'
	        },
	        LOG: {
	            FROM: 'From Date',
	            UNTIL: 'To Date',
	            SHOW_FILE: 'Show Records'
	        },
	        CONTACT: {
	            DELETE: 'Delete Contact',
	            SAVE: 'Save Contact',
	            TITLE: 'Τίτλος',
	            CON: 'Contact',
	            NAME: 'Full Name',
	            COMPANY: 'Organisation',
	            ADMINISTRATION: 'Administration',
	            TYPE: 'Category',
	            ADDRESS: 'Address',
	            EMAIL: 'Email',
	            NOTES: 'Notes',
	            FACILITIES: 'Facilities',
	            PROVIDERS: 'Providers'
	        },
	        HOUSING: {
	            DELETE: 'Delete Housing',
	            SAVE: 'Save Housing',
	            EDIT_HOUSING: 'Edit Housing ',
	            TYPE: 'Category',
	            STATUS: 'Status',
	            CAPACITY: 'CApacity',
	            HOUSING_COUNT: 'Units',
	            ATTENDANCE: 'Attendance',
	            CANCEL: 'CANCEL',
	            SELECT: 'SELECT'
	        },
	        LOGIN: {
	            USERNAME: 'Username',
	            PASSWORD: 'Password',
	            SIGNIN: 'SIGN IN'
	        },
	        USER: {
	            DELETE: 'Delete User',
	            SAVE: 'Save User',
	            FULLNAME: 'Full Name',
	            USERNAME: 'Username',
	            EMAIL_ERROR: 'The Email is not valid',
	            PHONENUMBER: 'Phone Number',
	            PASSWORD: 'Password',
	            CONFIRM_PASSWORD: 'Confirm Password',
	            CHANGE_PASSWORD: 'CHANGE PASSWORD: ',
	            NEW_PASSWORD: 'New Password'
	        },
	        PROVIDER: {
	            DELETE: 'Delete Provider',
	            SAVE: 'Save Provider',
	            TITLE: 'Facility',
	            NAME: 'Name',
	            DESCRIPTION: 'Description',
	            TYPE: 'Category',
	            PERSONEL_COUNT: 'Number of Personnel',
	            ADMINISTRATION: 'Administration',
	            SERVICES: 'Offering Services',
	            SERVICE: 'Service'
	        },
	        PERSON: {
	            DELETE: 'Delete Identified Person',
	            SAVE: 'Save Identified Person',
	            TITLE: 'Identified Person',
	            NAME: 'Full Name',
	            PASSPORT: 'Password',
	            NATIONALITY: 'Nationality',
	            IS_SENSITIVE: 'Sensitive',
	            SENSITIVITY: 'Sensitivity',
	            FACILITY: 'Facility',
	            RELATIVES: 'Relatives',
	            ADD_RELATIVE: 'ADD RELATIVE'
	        }
	    };

    	$translateProvider
	    	.translations('en', enUS)
	        .translations('el', elGR)
	        .fallbackLanguage('el')
	        .preferredLanguage('el')
	        .useSanitizeValueStrategy('escaped');
	});