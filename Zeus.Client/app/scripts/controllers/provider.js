'use strict';

angular
    .module('zeusclientApp')
    .controller('ProviderCtrl', function ($scope, $http, $routeParams, $uibModal, $location, lookupService, $rootScope, messageService, baseUrl, utilitiesService) {

        var isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;
        
        $scope.goBack = function () {
            var previous = $rootScope.previousRoot;
            if (previous.$$route.controllerAs == "facilities") {
                $location.url('/facilities');
            }
            else if (previous.$$route.controllerAs == "facility") {
                $location.url('/facilities/' + previous.params.id + '?tab=2');
            }
            else if (previous.$$route.controllerAs == "providersCtrl") {
                $location.url('/providers');
            }
            else { //default
                utilitiesService.goBack();
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

            if ($scope.provider.Type == "0")
                location = '/reports/7/' + facility.Facility.Id + '/' + facility.LastUpdateReportId;
            else if ($scope.provider.Type == "3")
                location = '/reports/0/' + facility.Facility.Id + '/' + facility.LastUpdateReportId;
            
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
                templateUrl: 'views/templates/lookup-modal.html',
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

        var load = function () {

            if (isInsert) {
                $scope.contact = {};
                $scope.provider = { Type: 0 };
                $scope.setFacilityColumns();
            } else {
                $http({
                    method: 'GET',
                    url: baseUrl + '/providers/' + $routeParams.id //the unique id of the provider
                }).then(function successCallback(response) {
                    $scope.provider = response.data;
                    $scope.setFacilityColumns();
                }, function errorCallback(response) {
                    messageService.showError(response.data);
                });
            }
        }

        $scope.setFacilityColumns = function () {
            var type = $scope.provider.Type;
            if (type == "0") {
                $scope.facilityColumns = [
                   { Caption: 'GRID.TYPE', Field: 'Facility.Type', Tooltip: 'Τύπος Εγκατάστασης' },
                   { Caption: 'GRID.NAME', Field: 'Facility.Name', Tooltip: 'Όνομα Εγκατάστασης' },
                   { Caption: 'PROVIDER.GROUP', Field: 'PersonnelText', Tooltip: 'Κλιμάκιο Εγκατάστασης' },
                   { Caption: 'PROVIDER.SERVICE', Field: 'ItemsText', Tooltip: 'Προσφερόμενες Υπηρεσίες' },
                   { Caption: 'REPORT.LASTUPDATE', Type: 'DateTime', Field: 'LastUpdated', Tooltip: 'Τελευταία Ενημέρωση' }
                ];
            }
            else if (type == "3") {
                $scope.facilityColumns = [
                   { Caption: 'GRID.TYPE', Field: 'Facility.Type', Tooltip: 'Τύπος Εγκατάστασης' },
                   { Caption: 'GRID.NAME', Field: 'Facility.Name', Tooltip: 'Όνομα Εγκατάστασης' },
                   { Caption: 'FEEDING_REPORT.RATIONS', Field: 'ItemsText', Tooltip: 'Γεύμα (Μερίδες)' },
                   { Caption: 'REPORT.LASTUPDATE', Type: 'DateTime', Field: 'LastUpdated', Tooltip: 'Τελευταία Ενημέρωση' }
                ];
            }
            else {
                $scope.facilityColumns = [
                    { Caption: 'GRID.TYPE', Field: 'Facility.Type', Tooltip: 'Τύπος Εγκατάστασης' },
                    { Caption: 'GRID.NAME', Field: 'Facility.Name', Tooltip: 'Όνομα Εγκατάστασης' },
                    { Caption: 'GRID.DESCRIPTION', Field: 'Facility.Description', Tooltip: 'Περιγραφή Εγκατάστασης' },
                    { Caption: 'GRID.CAPACITY', Field: 'Facility.Capacity', Tooltip: 'Τρέχουσα Χωρητικότητα' },
                    { Caption: 'GRID.ADMINISTRATION', Field: 'Facility.Administration', Tooltip: 'Διοικητική Υπαγωγή' },
                    { Caption: 'GRID.ATTENDANCE', Field: 'Facility.Attendance', Tooltip: 'Πλήθος Φιλοξενούμενων' },
                    { Caption: 'GRID.UTILIZATION', Field: 'Facility.Utilization', Type: 'Percentage', Tooltip: 'Ποσοστό Πληρότητας' },
                ];
            }
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
                $scope.provider = response.data;
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

        load();
    });
