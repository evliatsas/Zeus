'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, $window, $timeout, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.housingcolumns = [
          { Caption: 'Τύπος', Field: 'Type', Values: lookupService.housingCategories, Tooltip: 'Τύπος Εγκατάστασης' },
          { Caption: 'Χωρητικότητα', Field: 'Capacity', Type: 'LookupHtml', Tooltip: 'Χωρητικότητα' },
          { Caption: 'Παρευρισκόμενοι', Field: 'Attendance', Tooltip: 'Παρευρισκόμενοι' },
          { Caption: 'Πλήθος', Field: 'Count', Tooltip: 'Πλήθος' },
          { Caption: 'Ποσοστό', Field: 'Utilization', Tooltip: 'Ποσοστό' },
          { Caption: 'Κατάσταση', Field: 'Status', Values: lookupService.statuses, Tooltip: 'Κατάσταση' }
        ];

        $scope.contactscolumns = [
          { Caption: 'Ονοματεπώνυμο', Field: 'Name', Tooltip: 'Ονοματεπώνυμο' },
          { Caption: 'Τίτλος', Field: 'Title', Tooltip: 'Τίτλος' },
          { Caption: 'Φορέας', Field: 'Company', Tooltip: 'Φορέας' },
          { Caption: 'Υπαγωγή', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Υπαγωγή' },
          { Caption: 'Καθήκοντα', Field: 'Type', Values: lookupService.contactTypes, Tooltip: 'Καθήκοντα' },
          { Caption: 'Διεύθυνση', Field: 'Address', Tooltip: 'Διεύθυνση' },
          { Caption: 'Τηλέφωνα', Field: 'Phones', Tooltip: 'Τηλέφωνα' },
          { Caption: 'Email', Field: 'Email', Tooltip: 'Email' }
        ]; providerscolumns

        $scope.providerscolumns = [
         { Caption: 'Όνομα', Field: 'Name', Tooltip: 'Ονοματεπώνυμο' },
         { Caption: 'Περιγραφή', Field: 'Description', Tooltip: 'Τίτλος' },
         { Caption: 'Πρωσοπικό', Field: 'PersonnelCount', Tooltip: 'Φορέας' },
         { Caption: 'Υπαγωγή', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Υπαγωγή' },
         { Caption: 'Καθήκοντα', Field: 'Items', Tooltip: 'Καθήκοντα' },
         { Caption: 'Επαφές', Field: 'Contacts', Tooltip: 'Διεύθυνση' },
         { Caption: 'Τηλέφωνα', Field: 'Facilities', Tooltip: 'Τηλέφωνα' },
         { Caption: 'Τύπος Προμηθευτή', Field: 'Type', Values: lookupService.providerTypes, Tooltip: 'Τύπος Προμηθευτή' }
        ]; 

        $scope.reportcolumns = [
            { Caption: 'Τ', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];
               
        $scope.saveFacility = function () {
            $http({
                method: $routeParams.id == "new" ? 'POST' : 'PUT',
                data: $scope.data,
                url: baseUrl + '/facilities'
            }).then(function successCallback(response) {
                $scope.data = response.data;
                return true;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
                return false;
            });
        }

        var scrollToEnd = function () {
            $timeout(
                function () {
                    $window.scrollTo(0, document.body.scrollHeight);
                }, 0);
        }

        $scope.addHousing = function () {
            $scope.data.Housings.push({});
            scrollToEnd();
        }

        $scope.addContact = function () {
            $scope.data.Contacts.push({});
            scrollToEnd();
        }

        $scope.addProvider = function () {
            $scope.data.Providers.push({});
            scrollToEnd();
        }

        if ($routeParams.id == "new") {

            $scope.data = {
                Location: {
                    Type: 'Point',
                    Coordinates: [38.5306122, 25.4556341]
                }
            };

        } else {

            $http({
                method: 'GET',
                url: baseUrl + '/facilities/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        // REPORTS

        // issue a message to a contact
        $scope.sendMessage = function (fid, rid) {
            $location.url('/reports/6/' + fid + '/new');
        }
       
    });
