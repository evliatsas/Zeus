'use strict';

angular
	.module('zeusclientApp')
    .config(function ($translateProvider) {

    	var elGR = {
	    	MENU: {
	    	    BRAND: 'ξ ε ν ί α',
                REPORTS:"Δελτίο Τύπου",
	    		FACILITIES: 'Δομές Φιλοξενίας',
	    		CONTACTS: 'Επαφές',
	    		PROVIDERS: 'Υποστήριξη',
	    		PERSONS: 'Ταυτοποιήσεις',
	    		MAP: 'Χάρτης',
	    		CHARTS: 'Στατιστικά',
	    		USERS: 'Χρήστες',
	    		ARCHIVES: 'Αρχείο',
                OPERATIONS: 'Επιχειρήσεις',
	    		LOG: 'Ενέργειες Χρηστών',
                TITLE:'Αλλαγή Κωδικού Πρόσβασης',
                ADMIN: 'Διαχείριση',
	    		SUPPORT: {
	    			HELP: 'Εγχειρίδιο Χρήσης',
	    			ABOUT: 'Σχετικά'
	    		},
	    		USER_MENU: {
	    			SIGN_IN: 'Είσοδος',
	    			CHANGE_PASSWORD: 'Αλλαγή Κωδικού',
	    			OLD_PASSWORD: 'Παλιός Κωδικός Πρόσβασης',
	    			NEW_PASSWORD: 'Νέος Κωδικός Πρόσβασης',
	    			CONFIRM_NEW_PASSWORD: 'Επαλήθευση Κωδικού Πρόσβασης',
	    			CHANGE_PASSWORD_BTN: 'ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ',
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
	    	    DESCRIPTION: 'Περιγραφή',
	    	    CATEGORY:'Κατηγορία',
	    	    TYPE: 'Τύπος',
	    	    TITLE_CAPACITY: 'Χωρητικότητα',
	    	    CAPACITY: 'Τρέχουσα',
	    	    MAXCAPACITY: 'Μέγιστη',
	    	    REPORT_CAPACITY: 'Αναφοράς',
	    	    ATTENDANCE: 'Φιλοξενούμενοι: ',
	    	    ISSECURE: 'Φυλασσόμενος Χώρος',
	    	    HAS_HEALTHCARE: 'Υγεινομική Υποστήριξη',
	    	    STATUS: 'Κατάσταση',
	    	    ADMINISTRATION: 'Διαχείριση',
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
	    	    MESSAGE: 'Μήνυμα',
	    	    FEEDING: 'Σίτηση'
	    	},
	    	FACILITY_MAP: {
	    	    GUESTS: 'Φιλοξενούμενοι: ',
	    	    CAPACITY: 'Χωρητικότητα',
                REPORTS:'Αναφορές: ',
	    	    UTILIZATION: 'Πληρότητα',
	    	    TRANSITION: 'Μετάβαση',
	    	    SAVE: 'Αποθήκευση',
	    	    MOVE: 'Μετακίνηση'
	    	},
	    	CHARTS: {
	    		FROM: 'Από',
	    		UNTIL: 'Εώς',
	    		SHOW: 'ΕΜΦΑΝΙΣΗ'
	    	},
	    	LOOKUP_MODAL: {
	    	    CANCEL: 'ΑΚΥΡΩΣΗ',
	    	    SELECT: 'ΕΠΙΛΟΓΗ'
	    	},
	    	PHONE_LIST: {
	    	    PHONES: 'Τηλέφωνα Επικοινωνίας',
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
	    	    PRIORITY: 'Προτεραιότητα',
	    	    SUBJECT: 'Θέμα',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    TYPE: 'Είδος Στέγασης',
	    	    HOUSE_COUNT: 'Πλήθος Ατόμων',
	    	    NOTES: 'Κείμενο'
	    	},
	    	REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    NOT_ARCHIVED: 'Αρχειοθέτηση Αναφοράς',
	    	    ARCHIVED: 'Εξαγωγή Αναφοράς από Αρχείο',
	    	    PRIORITY: 'Προτεραιότητα',
	    	    FACILITY: 'Δομή Φιλοξενίας: ',
	    	    SUBJECT: 'Θέμα',
                NOTES:'Κείμενο'
	    	},
	    	SITUATION_REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα',
	    	    CHILDREN: 'Πλήθος Παιδιών ',
	    	    SUBJECT: 'Θέμα',
	    	    PERSON_COUNT: 'Πλήθος Ατόμων',
	    	    SENSITIVE_COUNT: 'Άτομα Ευαίσθητης Ομάδας',
	    	    NOTES: 'Κείμενο'
	    	},
	    	TRANSPORT_REPORT: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    PRIORITY: 'Προτεραιότητα',
	    	    SUBJECT: 'Θέμα',
	    	    STARTING_POINT: 'Από (Δομή Φιλοξενίας)',
	    	    DESTINATION: 'Πρός',
	    	    MOVEMENT_TYPE: 'Είδος Μετακίνησης',
	    	    PERSON_COUNT: 'Πλήθος Ατόμων',
	    	    DEPARTURE: 'Ημ. Αναχώρησης',
	    	    ETA: 'Εκτιμώμενη Ημ. Άφιξης',
	    	    TRANSPORT_TYPE: 'Μέσο Μεταφοράς',
	    	    TRANSPORT_UID: 'Μοναδικό Αναγνωριστικό',
                OWNER:'Ιδιοκτησία',
	    	    ISHIRED: 'Είναι Ναυλωμένο',
	    	    NOTES: 'Κείμενο'
	    	},
	    	ARCHIVE: {
	    	    DELETE: 'Διαγραφή Αναφοράς',
	    	    SAVE: 'Αποθήκευση Αναφοράς',
	    	    FROM: 'Ημερομηνία. Από',
	    	    UNTIL: 'Ημερομηνία. Έως',
	    	    SHOW_FILE: 'ΕΜΦΑΝΙΣΗ ΑΡΧΕΙΟΥ'
	    	},
	    	CALENDAR: {
	    	    DATE: 'Ημερομηνία',
	    	    SHOW_FILE: 'ΕΜΦΑΝΙΣΗ ΑΡΧΕΙΟΥ'
	    	},
	    	LOG: {
	    	    FROM: 'Ημερομηνία. Από',
	    	    UNTIL: 'Ημερομηνία. Έως',
	    	    SHOW_FILE: 'ΕΜΦΑΝΙΣΗ ΕΓΓΡΑΦΩΝ'
	    	},
	    	CONTACT: {
	    	    DELETE: 'Διαγραφή Επαφής',
	    	    SAVE: 'Αποθήκευση Επαφής',
	    	    CON:'Επαφή: ',
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
	    	OPERATION: {
	    	    OPS: 'ΕΠΙΧΕΙΡΗΣΗ: ',
                NAME: 'Όνομα',
	    	    DELETE: 'Διαγραφή Επιχείρησης',
	    	    SAVE: 'Αποθήκευση Επιχείρησης',
	    	    PRIORITY: 'Προτεραιότητα: ',
	    	    TYPE: 'Κατηγορία',
	    	    START: 'Ημερομηνία Έναρξης',
	    	    ETA: 'Εκτιμώμενη Ημερομηνία Πέρατος',
	    	    END: 'Ημερομηνία Πέρατος',
	    	    STARTFACILITY: 'Σημείο Εκκίνησης',
	    	    DESTFACILITY: 'Προορισμός',
	    	    PERSON_COUNT: 'Πλήθος Ατόμων',
	    	    PREPERATIONS: 'Προετοιμασία',
	    	    TRANSPORTS: 'Μέσα Μετακίνησης',
	    	    PROVIDERS: 'Υποστήριξη',
	    	    CONTACT: 'Επαφή Προορισμού',
	    	    CANCEL: 'Ακύρωση Επιχείρησης',
                INSTRUCTIONS: 'Οδηγίες',
	    	    PROBLEMS: 'Προβλήματα',
	    	    NOTES: 'Σημειώσεις',
	    	    CARRIER: 'Φορέας',
	    	    PROGRESS: 'Πρόοδος',
	    	    SUPERVISOR: 'Υπεύθυνος'
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
	    	    SAVE: 'ΑΠΟΘΗΚΕΥΣΗ'
	    	},
	    	LOGIN: {
                TITLE:'Παρακαλώ Συνδεθείτε',
	    	    USERNAME: 'Όνομα Χρήστη',
	    	    PASSWORD: 'Κωδικός Πρόσβασης',
	    	    SIGN_IN: 'ΕΙΣΟΔΟΣ'
	    	},
	    	USER: {
	    	    DELETE: 'Διαγραφή Χρήστη',
	    	    SAVE: 'Αποθήκευση Χρήστη',
                TITLE:'Χρήστης: ',
	    	    FULLNAME: 'Όνοματεπώνυμο',
	    	    USERNAME: 'Όνομα Χρήστη',
	    	    EMAIL: 'Email',
	    	    EMAIL_ERROR: 'To Email δεν είναι έγκυρο',             
	    	    PHONENUMBER: 'Τηλέφωνο',
	    	    PASSWORD: 'Κωδικός Πρόσβασης',
	    	    CONFIRM_PASSWORD: 'Επιβεβαίωση Κωδικού',
	    	    CONFIRM_PASSWORD_ERROR:'Ο κωδικός δεν ταιριάζει',
	    	    CHANGE_PASSWORD: 'ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ',
	    	    NEW_PASSWORD: 'Νέος Κωδικός Πρόσβασης',
	    	    ROLES: 'Ρόλοι',
	    	    CLAIMS: 'Δικαιώματα',
	    	    ROLE: 'Ρόλος',
	    	    CLAIM: 'Δικαίωμα'
	    	},
	    	PROVIDER: {
	    	    DELETE: 'Διαγραφή Προμηθευτή',
	    	    SAVE: 'Αποθήκευση Προμηθευτή',
	    	    TITLE: 'Φoρέας Υποστήριξης: ',
	    	    NAME: 'Όνομασία',
	    	    DESCRIPTION: 'Περιγραφή',
	    	    TYPE: 'Είδος',
	    	    PERSONNEL:'Προσωπικό',
	    	    PERSONNEL_COUNT: 'Πλήθος',
	    	    PERSONNEL_TYPE: 'Κατηγορία',
	    	    ADMINISTRATION: 'Διαχείριση',
	    	    SERVICES: 'Προσφερόμενες Υπηρεσίες',
	    	    SERVICE: 'Υπηρεσία',
	    	    INSTRUCTIONS: 'Οδηγίες',
	    	    NOTES: 'Σημειώσεις',
	    	    FACILITIES: 'Δομές Φιλοξενίας',
	    	    CONTACTS: 'Επαφές',
                TOTAL: 'Σύνολο'
	    	},
	    	PERSON: {
	    	    DELETE: 'Διαγραφή Ταυτοποιημένου',
	    	    SAVE: 'Αποθήκευση Ταυτοποιημένου',
	    	    TITLE: 'Ταυτοποιημένος: ',
	    	    NAME: 'Όνομα',
	    	    PASSPORT: 'Διαβατήριο',
                AGE: 'Ηλικία',
	    	    NATIONALITY: 'Εθνικότητα',
	    	    IS_SENSITIVE: 'Ευπαθής',
	    	    SENSITIVITY: 'Ευπάθεια',
	    	    FACILITY: 'Δομή Φιλοξενείας',
	    	    RELATIVES: 'Συγγενείς',
	    	    ADD_RELATIVE: 'ΠΡΟΣΘΗΚΗ ΣΥΓΓΕΝΗ'
	    	},
	    	GRID: {
	    	    ADD: 'Προσθήκη νέου',
	    	    SEARCH: 'Αναζήτηση',
	    	    FIRST: 'Πρώτη',
	    	    LAST: 'Τελευταία',
	    	    PREVIOUS: 'Προηγούμενη',
	    	    NEXT: 'Επόμενη',
	    	    RECORDS: 'εγγρ.',
	    	    TYPE: 'Τύπος',
	    	    CAPACITY: 'Χωρητικότητα',
	    	    ATTENDANCE: 'Φιλοξενούμενοι',
	    	    COUNT: 'Πλήθος',
	    	    UTILIZATION: 'Πληρότητα',
	    	    STATUS: 'Κατάσταση',
	    	    NAME: 'Όνομα',
	    	    TITLE: 'Τίτλος',
	    	    COMPANY: 'Οργανισμός',
	    	    ADMINISTRATION: 'Διαχείριση',
	    	    DESCRIPTION: 'Περιγραφή',
	    	    PERSONNEL: 'Προσωπικό',
	    	    PRIORITY: 'Προτ.',
	    	    SUBJECT: 'Θέμα',
	    	    AUTHOR: 'Συντάκτης',
	    	    DATETIME: 'Ημερομηνία',
	    	    NATIONALITY: 'Εθνικότητα',
	    	    AGE: 'Ηλικία',
	    	    SENSITIVE: 'Ευπάθεια',
	    	    SENSITIVITY: 'Είδος Ευπαθ.',
	    	    FACILITY: 'Δομή Φιλοξενίας',
	    	    ADDRESS: 'Διεύθυνση',
	    	    START: 'Έναρξη',
	    	    ETA: 'Εκτιμ. Πέρας',
	    	    END: 'Πέρας',
	    	    CANCEL: 'Έχει Ακυρωθεί'
	    	},
	    	MODAL: {
	    	    CONTACTS: 'Επιλογή Επαφών',
	    	    PROVIDERS: 'Επιλογή Προμηθευτών',
	    	    PEOPLE: 'Επιλογή Ατόμων',
	    	    FACILITY: 'Επιλογή Δομών Φιλοξενίας'
	    	}
	    };

	    var enUS = {
	        MENU: {
	            BRAND: 'ξ ε ν ί α',
	            REPORTS: "Daily Report",
	            FACILITIES: 'Facilities',
	            CONTACTS: 'Contacts',
	            PROVIDERS: 'Providers',
	            PERSONS: 'Identifications',
	            MAP: 'Map',
	            CHARTS: 'Statistics',
	            USERS: 'Users',
	            ARCHIVES: 'Archive',
	            OPERATIONS: 'Operations',
	            LOG: 'Log Entries',
	            ADMIN: 'Administration',
	            TITLE: 'Change Password',
	            SUPPORT: {
	                HELP: 'Manual',
	                ABOUT: 'About'
	            },
	            USER_MENU: {
	                SIGN_IN: 'Sign In',
	                CHANGE_PASSWORD: 'Change Password',
	                OLD_PASSWORD: 'Old Password',
	                NEW_PASSWORD: 'New Password',
	                CONFIRM_NEW_PASSWORD: 'Confirm New Password',
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
	            CATEGORY: 'Category',
	            TYPE: 'Type',
	            TITLE_CAPACITY: 'Capacity',
	            CAPACITY: 'Current',
	            MAXCAPACITY: 'Maximum',
	            REPORT_CAPACITY:'Report',
	            ATTENDANCE: 'Attendance',
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
	            HOUSING: 'Housing',
	            TRANSPORT: 'Transport',
	            SITUATION: 'Situation',
	            PROBLEM: 'Problem',
	            MESSAGE: 'Message',
	            FEEDING: 'Feeding'
	        },
	        FACILITY_MAP: {
	            GUESTS: 'Guests: ',
	            CAPACITY: 'Capacity',
	            UTILIZATION: 'Utilization',
	            TRANSITION: 'Transition',
	            SAVE: 'Save',
	            MOVE: 'Move'
	        },
	        CHARTS: {
	    		FROM: 'From',
	    		UNTIL: 'Until',
	    		SHOW: 'Show'
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
	            FACILITY: 'Facility',
	            SUBJECT: 'Subject',
	            NOTES: 'Notes'
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
	            PRIORITY: 'Priority',
	            SUBJECT: 'Subject',
	            STARTING_POINT: 'From (Facility)',
	            DESTINATION: 'To (Facility)',
	            MOVEMENT_TYPE: 'Type of Transportation',
	            PERSON_COUNT: 'Number of Persons',
	            DEPARTURE: 'Departure Date',
	            ETA: 'Estimated Time of Arrival',
	            TRANSPORT_TYPE: 'Vehicle',
	            TRANSPORT_UID: 'Unique Identifier',
	            OWNER: 'Ownership',
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
	        CALENDAR: {
	            DATE: 'DATE',
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
	            TITLE: 'Title',
	            CON: 'Contact: ',
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
	        OPERATION: {
                OPS: 'OPERATION: ',
                NAME: 'Name',
	            DELETE: 'Delete Operation',
	            SAVE: 'Save Operation',
	            PRIORITY: 'Priority: ',
	            TYPE: 'Type',
	            START: 'Start Date Time',
	            ETA: 'Estimated Completion Date Time',
	            END: 'Completion Date Time',
	            STARTFACILITY: 'Starting Location',
	            DESTFACILITY: 'Destination',
	            PERSON_COUNT: 'Persons Count',
	            PREPERATIONS: 'Preparation',
	            TRANSPORTS: 'Transport',
	            PROVIDERS: 'Providers',
	            CONTACT: 'Destination Contact',
	            CANCEL: 'Cancel Operation',
	            INSTRUCTIONS: 'Instructions',
	            PROBLEMS: 'Problems',
	            NOTES: 'Notes',
	            CARRIER: 'Carrier',
	            PROGRESS: 'Progress',
                SUPERVISOR: 'Supervisor'
	        },
	        HOUSING: {
	            DELETE: 'Delete Housing',
	            SAVE: 'Save Housing',
	            EDIT_HOUSING: 'Edit Housing ',
	            TYPE: 'Category',
	            STATUS: 'Status',
	            CAPACITY: 'Unit Capacity',
	            HOUSING_COUNT: 'Units',
	            ATTENDANCE: 'Attendance',
	            CANCEL: 'CANCEL',
	            SAVE: 'SAVE'
	        },
	        LOGIN: {
	            TITLE: 'Please sign in',
	            USERNAME: 'Username',
	            PASSWORD: 'Password',
	            SIGNIN: 'SIGN IN'
	        },
	        USER: {
	            DELETE: 'Delete User',
	            SAVE: 'Save User',
	            TITLE: 'User: ',
	            FULLNAME: 'Full Name',
	            USERNAME: 'Username',
	            EMAIL_ERROR: 'The Email is not valid',
                EMAIL:'Email',
	            PHONENUMBER: 'Phone Number',
	            PASSWORD: 'Password',
	            CONFIRM_PASSWORD: 'Confirm Password',
	            CONFIRM_PASSWORD_ERROR: 'Password does not match',
	            CHANGE_PASSWORD: 'CHANGE PASSWORD: ',
	            NEW_PASSWORD: 'New Password',
	    	    ROLES: 'Roles',
	    	    CLAIMS: 'Claims',
	    	    ROLE: 'Role',
	    	    CLAIM: 'Claim'
	        },
	        PROVIDER: {
	            DELETE: 'Delete Provider',
	            SAVE: 'Save Provider',
	            TITLE: 'Facility',
	            NAME: 'Name',
	            DESCRIPTION: 'Description',
	            TYPE: 'Type',
	            EMPLOYEE_TYPE: 'Category',
	            PERSONNEL: 'Personnel',
	            PERSONEL_COUNT: 'Number',
	            ADMINISTRATION: 'Administration',
	            SERVICES: 'Offering Services',
	            SERVICE: 'Service',
	            INSTRUCTIONS:'Instuctions',
	            NOTES: 'Notes',
	            FACILITIES: 'Facilities',
	            CONTACTS: 'Contacts',
	            TOTAL: 'Total'
	        },
	        PERSON: {
	            DELETE: 'Delete Identified Person',
	            SAVE: 'Save Identified Person',
	            TITLE: 'Identified Person',
	            NAME: 'Full Name',
	            PASSPORT: 'Password',
                AGE: 'Age',
	            NATIONALITY: 'Nationality',
	            IS_SENSITIVE: 'Sensitive',
	            SENSITIVITY: 'Sensitivity',
	            FACILITY: 'Facility',
	            RELATIVES: 'Relatives',
	            ADD_RELATIVE: 'ADD RELATIVE'
	        },
	        GRID: {
	            ADD: 'Add New',
	            SEARCH: 'Search',
	            FIRST: 'First',
	            LAST: 'Last',
	            PREVIOUS: 'Previous',
	            NEXT: 'Next',
                RECORDS: 'rec',
	            TYPE: 'Type',
	            CAPACITY: 'Capacity',
	            ATTENDANCE: 'Guests',
	            COUNT: 'Count',
	            UTILIZATION: 'Utilization',
	            STATUS: 'Status',
	            NAME: 'Name',
	            TITLE: 'Title',
	            COMPANY: 'Organization',
	            ADMINISTRATION: 'Administration',
	            DESCRIPTION: 'Description',
	            PERSONNEL: 'Personnel',
	            PRIORITY: 'Prior.',
	            SUBJECT: 'Subject',
	            AUTHOR: 'Author',
	            DATETIME: 'Date Time',
	            NATIONALITY: 'Nanionality',
	            AGE: 'Age',
	            SENSITIVE: 'Sensitive',
	            SENSITIVITY: 'Sensitivity',
	            FACILITY: 'Facility',
	            ADDRESS: 'Address',
	            START: 'Start',
	            ETA: 'ETA',
	            END: 'Arrival',
                CANCEL:'Cancelled'
	        },
	        MODAL: {
	            CONTACTS: 'Select Contacts',
	            PROVIDERS: 'Select Providers',
	            PEOPLE: 'Select Person',
	            FACILITY: 'Select Facilities'
	        }
	    };

    	$translateProvider
	    	.translations('en', enUS)
	        .translations('el', elGR)
	        .fallbackLanguage('el')
	        .preferredLanguage('el')
	        .useSanitizeValueStrategy('escaped');
	});