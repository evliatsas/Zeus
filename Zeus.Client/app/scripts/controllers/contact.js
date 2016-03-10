'use strict';

angular
    .module('zeusclientApp')
    .controller('ContactCtrl', function ($scope, $http, $routeParams, $location, baseUrl, lookupService, messageService) {

        var isInsert = $routeParams.id == 'new';

        $scope.reportcolumns = [
             { Caption: 'Τίτλος', Field: 'Title', Tooltip: 'Τίτλος Προμηθευτή' },
             { Caption: 'Όνοματεπώνυμο', Field: 'Name', Tooltip: 'Όνομα Επαφής' },
             { Caption: 'Εταιρία', Field: 'Company', Tooltip: 'Εταιρία' },
             { Caption: 'Διαχειριστής', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Διοικητική Υπαγωγή' },
             { Caption: 'Κατηγορία', Field: 'Type', Values: lookupService.contactTypes, Tooltip: 'Τύπος Επαφής' },
             { Caption: 'Διεύθυνση', Field: 'Address', Tooltip: 'Διεύθυνση' },
             { Caption: 'Τηλέφωνα', Field: 'Phones', Tooltip: 'Διοικητική Υπαγωγή' },
             { Caption: 'Email', Field: 'Email', Tooltip: 'Email Επαφής' } 
        ];

        if (isInsert) {
            $scope.contact = {};
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/contacts/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.contact = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        // SAVE - DELETE
        $scope.save = function () {
            if (isInsert) {
                // Create contact
                var method = 'POST';
            }
            else {
                // Update contact
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.contact,
                url: baseUrl + '/contacts'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.contact = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteItem = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/contacts/' + $scope.contact.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/contacts');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteItem);
        }
    });
