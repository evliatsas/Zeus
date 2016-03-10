'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, $window, $timeout, $http, $routeParams, $location, $uibModal, lookupService, messageService, baseUrl) {

        var isInsert = $routeParams.id == 'new';

        $scope.housingcolumns = [
            { Caption: 'Τύπος', Field: 'Type', Values: lookupService.housingCategories, Tooltip: 'Τύπος Εγκατάστασης' },
            { Caption: 'Χωρητικότητα', Field: 'Capacity', Tooltip: 'Χωρητικότητα' },
            { Caption: 'Παρευρισκόμενοι', Field: 'Attendance', Tooltip: 'Παρευρισκόμενοι' },
            { Caption: 'Πλήθος', Field: 'Count', Tooltip: 'Πλήθος' },
            { Caption: 'Πληρότητα', Field: 'Utilization', Type: 'Percentage', Tooltip: 'Ποσοστό' },
            { Caption: 'Κατάσταση', Field: 'Status', Values: lookupService.statuses, Tooltip: 'Κατάσταση' }
        ];

        $scope.contactColumns = [
            { Caption: 'Τύπος', Field: 'Type' },
            { Caption: 'Όνομα', Field: 'Name' },
            { Caption: 'Τίτλος', Field: 'Title' },
            { Caption: 'Οργανισμός', Field: 'Company' },
            { Caption: 'Διαχείριση', Field: 'Administration' }
        ];

        $scope.providerColumns = [
           { Caption: 'Τύπος', Field: 'Type', Type: 'Lookup', Values: lookupService.providerTypes, Tooltip: 'Τύπος Υποστήριξης' },
           { Caption: 'Όνομα', Field: 'Name' },
           { Caption: 'Περιγραφή', Field: 'Description' },
           { Caption: 'Πλ. Πρσ.', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
           { Caption: 'Διαχείριση', Field: 'Administration' }
        ];

        $scope.reportcolumns = [
            { Caption: 'Τ', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];
       
        var scrollToEnd = function () {
            $timeout(
                function () {
                    $window.scrollTo(0, document.body.scrollHeight);
                }, 0);
        }

        // HOUSING
        var selectedHousing = {};

        $scope.addHousing = function () {
            var housing = {};
            selectedHousing = null;
            editHousing(housing);
        }
        
        $scope.editHousing = function (housing) {
            selectedHousing = housing;
            editHousing(housing);
        }

        var editHousing = function (housing) {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/views/housing.html',
                controller: 'HousingCtrl',
                controllerAs: 'housingCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            housing: housing
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                if (selectedHousing == null) {
                    $scope.data.Housings.push(data.housing);
                }
                else {
                    selectedHousing = data.housing;

                    if (selectedHousing.Tag && selectedHousing.Tag == 'remove') {
                        var index = $scope.data.Housings.indexOf(selectedHousing);
                        $scope.data.Housings.splice(index, 1);
                    }
                }
            }, function () {
                //modal dismissed
            });
        }

        //*************

        $scope.showReport = function (report) {
            var location = '/reports/' + report.Type + '/' + $scope.data.Id + '/' + report.Id;
            $location.url(location);
        }

        $scope.addContact = function () {
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
                            selected: $scope.data.Contacts
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.data.Contacts = data.selected;
            }, function () {
                //modal dismissed
            });
        }

        $scope.showContact = function (contact) {
            var location = '/contacts/' + contact.Id;
            $location.url(location);
        }

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
                            selected: $scope.data.Providers
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.data.Providers = data.selected;
            }, function () {
                //modal dismissed
            });
        }

        $scope.showProvider = function (provider) {
            var location = '/providers/' + provider.Id;
            $location.url(location);
        }

        if (isInsert) {
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

        // SAVE - DELETE
        $scope.save = function () {
            if (isInsert) {
                // Create facility
                var method = 'POST';
            }
            else {
                // Update facility
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.data,
                url: baseUrl + '/facilities'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteFacility = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/facilities/' + $scope.data.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/facilities');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteFacility);
        }

        // REPORTS

        // issue a message to a contact
        $scope.sendMessage = function (fid, rid) {
            $location.url('/reports/6/' + fid + '/new');
        }
    });
