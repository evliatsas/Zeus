'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonsCtrl', function ($scope, lookupService) {

        $scope.addPerson = function () {
            alert('add person');
        }

        $scope.reportcolumns = [
            { Caption: 'Όνομα', Field: 'Name' },
            { Caption: 'Εθνικότητα', Field: 'Nationality' },
            { Caption: 'Διαβατήριο', Field: 'Passport' },
            { Caption: 'Ηλικία', Field: 'Age', Type: 'Number' },
            { Caption: 'Ευπαθής', Field: 'IsSensitive', Type: 'Boolean' },
            { Caption: 'Ευπάθεια', Field: 'Sensitivity' },
            { Caption: 'Δομή', Field: 'Facility.Name'}
        ];

        $scope.data = [{
            "Id": "ABCD",
            "Name": "Λιμάνι Πειραιά"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Σπίτι Κανελλόπουλου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }, {
            "Name": "Στρατόπεδο Παπάγου"
        }];
    });
