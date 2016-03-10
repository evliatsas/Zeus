'use strict';

angular
    .module('zeusclientApp')
    .controller('ContactCtrl', function ($scope, $http, $routeParams, $uibModal, $location, baseUrl, lookupService, messageService) {

        var isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;

        $scope.facilityColumns = [
             { Caption: 'Τύπος', Field: 'Type', Tooltip: 'Τύπος Εγκατάστασης' },
             { Caption: 'Όνομα', Field: 'Name', Tooltip: 'Όνομα Εγκατάστασης' },
             { Caption: 'Περιγραφή', Field: 'Description', Tooltip: 'Περιγραφή Εγκατάστασης' },
             { Caption: 'Χωρητικότητα', Field: 'Capacity', Tooltip: 'Τρέχουσα Χωρητικότητα' },
             { Caption: 'Διαχείριση', Field: 'Administration', Tooltip: 'Διοικητική Υπαγωγή' },
             { Caption: 'Φιλοξενούμενοι', Field: 'Attendance', Tooltip: 'Πλήθος Φιλοξενούμενων' },
             { Caption: 'Πληρότητα', Field: 'Utilization', Type: 'Percentage', Tooltip: 'Ποσοστό Πληρότητας' },
        ];

        $scope.addFacility = function () {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/templates/lookup-modal.html',
                controller: 'lookupCtrl',
                controllerAs: 'lookupCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            type: 'Facility',
                            selected: $scope.contact.Facilities
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.contact.Facilities = data.selected;
            }, function () {
                //modal dismissed
            });
        }

        $scope.showFacility = function (facility) {
            var location = '/facilities/' + facility.Id;
            $location.url(location);
        }

        $scope.providerColumns = [
              { Caption: 'Τύπος', Field: 'Type', Type: 'Lookup', Values: lookupService.providerTypes, Tooltip: 'Τύπος Υποστήριξης' },
              { Caption: 'Όνομα', Field: 'Name' },
              { Caption: 'Περιγραφή', Field: 'Description' },
              { Caption: 'Πλ. Πρσ.', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
              { Caption: 'Διαχείριση', Field: 'Administration' }
        ];

        $scope.addProvider = function () {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/templates/lookup-modal.html',
                controller: 'lookupCtrl',
                controllerAs: 'lookupCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            type: 'Provider',
                            selected: $scope.contact.Providers
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.contact.Providers = data.selected;
            }, function () {
                //modal dismissed
            });
        }

        $scope.showProvider = function (provider) {
            var location = '/providers/' + provider.Id;
            $location.url(location);
        }

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
