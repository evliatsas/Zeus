'use strict';

angular
    .module('zeusclientApp')
    .controller('ContactsCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl)  {

        var isInsert = $routeParams.pid == 'new';

        $scope.columns = [
            { Caption: 'Τίτλος', Field: 'Title', Tooltip: 'Τίτλος Προμηθευτή' },
            { Caption: 'Όνομα', Field: 'Name', Tooltip: 'Όνομα Επαφής' },
            { Caption: 'Εταιρία', Field: 'Company', Tooltip: 'Εταιρία' },
            { Caption: 'Υπαγωγή', Field: 'Administration', Values: lookupService.administrations, Tooltip: 'Διοικητική Υπαγωγή' },
            { Caption: 'Τύπος', Field: 'Type', Values: lookupService.contactTypes, Tooltip: 'Τύπος Επαφής' },
            { Caption: 'Διεύθυνση', Field: 'Address', Tooltip: 'Διεύθυνση' },
            { Caption: 'Υπαγωγή', Field: 'Administration', Tooltip: 'Διοικητική Υπαγωγή' },
            { Caption: 'Email', Field: 'Email', Tooltip: 'Email Επαφής' }
        ];

        $scope.lookup = lookupService;
        $scope.contact = {};

        $scope.addContact = function () {
            $location.url("/contacts/new");
        }

        //if (!isInsert) {
        //    $http({
        //        method: 'GET',
        //        url: baseUrl + '/contacts/' + $routeParams.pid //the unique id of the provider
        //    }).then(function successCallback(response) {
        //        $scope.provider = response.data;
        //    }, function errorCallback(response) {
        //        messageService.showError();
        //    });
        //}
        //else {
        //    $scope.contact = {};
        //    $scope.contacts.Items = [];
        //}

        //$scope.addItem = function () {
        //    $location.url('/contacts/new');
        //}

        //$scope.openItem = function (contact) {
        //    $location.url('/contacts/' + contact.Id);
        //}

        //$http({
        //    method: 'GET',
        //    url: baseUrl + '/contacts'
        //}).then(function successCallback(response) {
        //    $scope.contacts = response.data;
        //}, function errorCallback(response) {
        //    messageService.getFailed(response.error);
        //});

    });
