'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, lookupService, messageService) {

        $scope.reportcolumns = [
            { Caption: 'Τύπος', Field: 'Type', Type: 'LookupHtml', Values: lookupService.getReportTypes(), Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        var testFunc = function () {
            var q = 5;
        }

        $scope.addFacility = function () {
            messageService.askConfirmation(testFunc);
        }

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
            "Providers":[
                {
                    "Name": "noname",
                    "Description": "Το Lorem Ipsum είναι απλά ένα κείμενο χωρίς νόημα για τους επαγγελματίες της τυπογραφίας και στοιχειοθεσίας. Το Lorem Ipsum είναι το επαγγελματικό πρότυπο όσον αφορά το κείμενο χωρίς νόημα, από τον 15ο αιώνα, όταν ένας ανώνυμος τυπογράφος πήρε ένα δοκίμιο και ανακάτεψε τις λέξεις για να δημιουργήσει ένα δείγμα βιβλίου. Όχι μόνο επιβίωσε πέντε αιώνες, αλλά κυριάρχησε στην ηλεκτρονική στοιχειοθεσία, παραμένοντας με κάθε τρόπο αναλλοίωτο. Έγινε δημοφιλές τη δεκαετία του '60 με την έκδοση των δειγμάτων της Letraset όπου περιελάμβαναν αποσπάσματα του Lorem Ipsum, και πιο πρόσφατα με το λογισμικό ηλεκτρονικής σελιδοποίησης όπως το Aldus PageMaker που περιείχαν εκδοχές του Lorem Ipsum.",
                },
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
                    "Subject": "Πρόβλημα σε Χίο",
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
                    "Subject": "Επείγουσα Αερομεταφορά",
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
                    "Subject": "Πρωινό Γεύμα",
                    "Type": 3,
                    "IsAcknowledged": false
                }
            ]
        };

    });
