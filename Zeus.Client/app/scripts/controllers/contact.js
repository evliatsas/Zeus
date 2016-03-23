'use strict';

angular
    .module('zeusclientApp')
    .controller('ContactCtrl', function ($scope, $http, $routeParams, $uibModal, $location, baseUrl, lookupService, messageService) {

        var isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;

        $scope.facilityColumns = [
             { Caption: 'GRID.TYPE', Field: 'Type', Tooltip: 'Τύπος Εγκατάστασης' },
             { Caption: 'GRID.NAME', Field: 'Name', Tooltip: 'Όνομα Εγκατάστασης' },
             { Caption: 'GRID.DESCRIPTION', Field: 'Description', Tooltip: 'Περιγραφή Εγκατάστασης' },
             { Caption: 'GRID.CAPACITY', Field: 'Capacity', Tooltip: 'Τρέχουσα Χωρητικότητα' },
             { Caption: 'GRID.ADMINISTRATION', Field: 'Administration', Tooltip: 'Διοικητική Υπαγωγή' },
             { Caption: 'GRID.ATTENDANCE', Field: 'Attendance', Tooltip: 'Πλήθος Φιλοξενούμενων' },
             { Caption: 'GRID.UTILIZATION', Field: 'Utilization', Type: 'Percentage', Tooltip: 'Ποσοστό Πληρότητας' },
        ];

        $scope.goBack = function () {
            var previous = $rootScope.previousRoot;
            if (previous.$$route.controllerAs == "facilities") {
                $location.url('/facilities');
            }
            else if (previous.$$route.controllerAs == "facility") {
                $location.url('/facilities/' + previous.params.id + '?tab=1');
            }
            else { //default to reports list
                $location.url('/contacts');
            }
        }

        $scope.addFacility = function () {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: 'views/templates/lookup-modal.html',
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
              { Caption: 'GRID.TYPE', Field: 'Type', Type: 'Lookup', Values: lookupService.providerTypes, Tooltip: 'Τύπος Υποστήριξης' },
              { Caption: 'GRID.NAME', Field: 'Name' },
              { Caption: 'GRID.DESCRIPTION', Field: 'Description' },
              { Caption: 'GRID.PERSONNEL', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
              { Caption: 'GRID.ADMINISTRATION', Field: 'Administration' }
        ];

        $scope.addProvider = function () {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: 'views/templates/lookup-modal.html',
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
            $scope.contact = { Phones:[] };
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/contacts/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.contact = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
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
                messageService.showError(response.data);
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
                messageService.showError(response.data);
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteItem);
        }
    });
