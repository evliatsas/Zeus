'use strict';

angular
	.module('zeusclientApp')
    .config(function ($translateProvider) {

    	var elGR = {
	    	MENU: {
	    		BRAND: 'ξ ε ν ί α',
	    		FACILITIES: 'Δομές Φιλοξενίας',
	    		CONTACTS: 'contacts',
	    		PROVIDERS: 'providers',
	    		PERSONS: 'persons',
	    		MAP: 'map',
	    		CHARTS: 'charts',
	    		USERS: 'users',
	    		ARCHIVES: 'archives',
	    		SUPPORT: {
	    			HELP: 'help',
	    			ABOUT: 'about'
	    		},
	    		USER: {
	    			SIGN_IN: 'sign in',
	    			CHANGE_PASSWORD: 'change password',
	    			MESSAGES: 'messages',
	    			SIGN_OUT: 'sign out'
	    		}
	    	},
	    	FACILITY: {
	    		DELETE: 'Διαγραφή Προμηθευτή'
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