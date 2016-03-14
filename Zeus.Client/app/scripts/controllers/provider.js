'use strict';

angular
    .module('zeusclientApp')
    .controller('ProviderCtrl', function ($scope, $http, $routeParams, $uibModal, $location, lookupService, messageService, baseUrl) {

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

        $scope.addPersonnel = function () {
            $scope.provider.Personnel.push({
                "Type": "",
                "PersonnelCount": ""
            });
        }

        $scope.addItem = function () {
            $scope.provider.Items.push({              
            });
        }

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
                            selected: $scope.provider.Facilities
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.provider.Facilities = data.selected;
            }, function () {
                //modal dismissed
            });
        }
        
        $scope.showFacility = function (facility) {
            var location = '/facilities/' + facility.Id;
            $location.url(location);
        }

        $scope.contactColumns = [
           { Caption: 'GRID.TYPE', Field: 'Type' },
           { Caption: 'GRID.NAME', Field: 'Name' },
           { Caption: 'GRID.TITLE', Field: 'Title' },
           { Caption: 'GRID.COMPANY', Field: 'Company' },
           { Caption: 'GRID.ADMINISTRATION', Field: 'Administration' }
        ];

        $scope.addContact=function(){
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/templates/lookup-modal.html',
                controller: 'lookupCtrl',
                controllerAs: 'lookupCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            type: 'Contact',
                            selected: $scope.provider.Contacts
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.provider.Contacts = data.selected;
            }, function () {
                //modal dismissed
            });
        }

        $scope.showContact = function (contact) {
            var location = '/contacts/' + contact.Id;
            $location.url(location);
        }

        if (isInsert) {
            $scope.contact = {};
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/providers/' + $routeParams.id //the unique id of the provider
            }).then(function successCallback(response) {
                $scope.provider = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        // SAVE - DELETE
        $scope.save = function () {
            if (isInsert) {
                // Create provider
                var method = 'POST';
            }
            else {
                // Update provider
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.provider,
                url: baseUrl + '/providers'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteProvider = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/providers/' + $scope.provider.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/providers');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteProvider);
        }
    });
