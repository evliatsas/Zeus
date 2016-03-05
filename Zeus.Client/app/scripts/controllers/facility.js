'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope) {

        $scope.reporttypes = [
            { Id: 0, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Σίτισης">restaurant_menu</i>' },
            { Id: 1, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Στέγασης">local_hotel</i>' },
            { Id: 2, Description: '<i class="text-primary material-icons md-18" title="Αναφορά Μετακίνησης">airport_shuttle</i>' },
            { Id: 3, Description: '<i class="text-danger material-icons md-18" title="Αναφορά Προβλήματος">error</i>' },
            { Id: 4, Description: '<i class="text-warning material-icons md-18" title="Αναφορά Αίτησης">message</i>' },
            { Id: 5, Description: '<i class="text-info material-icons md-18" title="Αναφορά Κατάστασης">assignment</i>' }
        ];

        $scope.reportcolumns = [
            { Caption: 'Τύπος', Field: 'Type', Type: 'LookupHtml', Values: $scope.reporttypes, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Notes' },
            { Caption: 'Τίτλος', Field: 'Title' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        $scope.data = {
            "Id": "ABCD",
            "Name": "Λιμάνι Πειραιά",
            "Type": "Λιμάνι",
            "Description": "Χώρος προσωρινής φιλοξενίας στο λιμάνι του Πειραιά",
            "Capacity": 200,
            "Attendance": 300,
            "Utilization": 150,
            "Status": "Ενεργό",
            "Housings": [
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "ISOBOX",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                },
                {
                    "Type": "Σκηνή",
                    "Capacity": 200,
                    "Attendance": 300,
                    "Utilization": 150,
                    "Status": "Ενεργό"
                }
            ],
            "Contacts": [
                {
                    "Name": "Αντώνης Καταραχιάς",
                    "Title": "Διευθυντής Εγκαταστάσεων",
                    "Company": "Υπ. Εσωτερικών",
                    "Address": "Λεωφ. Κατεχάκης 44",
                    "Phones": [
                        {
                            "Type": "Κινητό",
                            "Number":"+03 6983511111"
                        },
                        {
                            "Type": "Σταθερό",
                            "Number":"+03 2106593750"
                        }
                    ],
                    "Email": "ak.kata@ypes.gr",
                    "Type": "Εγκαταστάσεις",
                    "Notes": "Προμήθεια αντισκοίνων μεγάλου μεγέθους"
                },
                {
                    "Name": "Ευάγγελος Λιάτσας",
                    "Title": "Διευθυντής",
                    "Company": "ΓΕΕΘΑ",
                    "Address": "Λεωφ. Μεσογείων 233",
                    "Phones": [
                        {
                            "Type": "Κινητό",
                            "Number": "+03 6983513485"
                        },
                        {
                            "Type": "Crypto",
                            "Number": "+112 5556487"
                        }
                    ],
                    "Email": "eliatsas@gea.haf.gr",
                    "Type": "ΚΕΠΙΧ",
                    "Notes": "Διαχειριστής Εφαρμογής Ζεύς"
                }
            ],
            "Reports": [
                {
                    "_id": "56daea1fb51eb41e38277438",
                    "Tag": null,
                    "Notes": "Σίτηση μεσημέρι",
                    "User": {
                        "UserName": "eliatsas",
                        "Contact": {
                            "Name": "Ευάγγελος Λιάτσας",
                            "Title": "Διευθυντής",
                            "Company": "ΓΕΕΘΑ"
                        },
                        "Title": "ΓΕΕΘΑ/Ευάγγελος Λιάτσας"
                    },
                    "Facility": null,
                    "DateTime": "2016-03-05T14:15:59.214Z",
                    "Type": 0,
                    "FeedingProvider": null,
                    "Rations": 0,
                    "Meal": "fasolia",
                    "IsAcknowledged": false
                },
                {
                    "_id": "56daea1fb51eb41e38277437",
                    "Tag": null,
                    "Notes": "request",
                    "User": {
                        "UserName": "akatarachias",
                        "Contact": {
                            "Name": "Αντώνης Καταραχιάς",
                            "Title": "Διευθυντής Εγκαταστάσεων",
                            "Company": "Υπ. Εσωτερικών"
                        },
                        "Title": "Υπ. Εσωτερικών/Αντώνης Καταραχιάς"
                    },
                    "Facility": null,
                    "DateTime": "2016-03-05T14:15:59.214Z",
                    "Type": 4,
                    "IsAcknowledged": true
                },
                {
                    "_id": "56daea1fb51eb41e38277436",                    
                    "Tag": null,
                    "Notes": "Πρόβλημα εγκατάστασης",
                    "User": {
                        "UserName": "akatarachias",
                        "Contact": {
                            "Name": "Αντώνης Καταραχιάς",
                            "Title": "Διευθυντής Εγκαταστάσεων",
                            "Company": "Υπ. Εσωτερικών"
                        },
                        "Title": "Υπ. Εσωτερικών/Αντώνης Καταραχιάς"
                    },
                    "Facility": null,
                    "DateTime": "2016-03-05T14:15:59.214Z",
                    "Type": 3,
                    "IsAcknowledged": false
                }
            ]
        };

    });
