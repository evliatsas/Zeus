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
                },
            ]
        };

    });
