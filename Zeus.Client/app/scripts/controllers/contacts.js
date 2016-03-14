'use strict';

angular
    .module('zeusclientApp')
    .controller('ContactsCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl)  {

        var isInsert = $routeParams.id == 'new';

        $scope.contactcolumns = [
            { Caption: 'GRID.TITLE', Field: 'Title', Tooltip: 'Τίτλος Προμηθευτή' },
            { Caption: 'GRID.NAME', Field: 'Name', Tooltip: 'Όνομα Επαφής' },
            { Caption: 'GRID.COMPANY', Field: 'Company', Tooltip: 'Εταιρία' },
            { Caption: 'GRID.ADMINISTRATION', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Διοικητική Υπαγωγή' },
            { Caption: 'GRID.TYPE', Field: 'Type', Values: lookupService.contactTypes, Tooltip: 'Τύπος Επαφής' },
            { Caption: 'GRID.ADDRESS', Field: 'Address', Tooltip: 'Διεύθυνση' },
            { Caption: 'Email', Field: 'Email', Tooltip: 'Email Επαφής' }
        ];

        $scope.lookup = lookupService;
        $scope.contact = {};

        $scope.addContact = function () {
            $location.url("/contacts/new");
        }

        $scope.openItem = function (contact) {
            if (!isInsert) {
                $location.url('/contacts/' + contact.Id);
            } else {
                $location.url('/contacts/new');
            }
        }

        $http({
            method: 'GET',
            url: baseUrl + '/contacts'
        }).then(function successCallback(response) {
            $scope.contacts = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
