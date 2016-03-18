'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, $window, $timeout, $http, $routeParams, $filter, $location, $uibModal, lookupService, messageService, baseUrl, commonUtilities) {

        var isInsert = $routeParams.id == 'new';
        $scope.activeTab = $routeParams.tab ? parseInt($routeParams.tab) : 0;

        $scope.formatDateTime = commonUtilities.formatDateTime;

        $scope.housingcolumns = [
            { Caption: 'GRID.TYPE', Field: 'Type', Values: lookupService.housingCategories, Tooltip: 'Τύπος Εγκατάστασης' },
            { Caption: 'GRID.CAPACITY', Field: 'Capacity', Tooltip: 'Χωρητικότητα' },
            { Caption: 'GRID.ATTENDANCE', Field: 'Attendance', Tooltip: 'Παρευρισκόμενοι' },
            { Caption: 'GRID.COUNT', Field: 'Count', Tooltip: 'Πλήθος' },
            { Caption: 'GRID.UTILIZATION', Field: 'Utilization', Type: 'Percentage', Tooltip: 'Ποσοστό' },
            { Caption: 'GRID.STATUS', Field: 'Status', Values: lookupService.statuses, Tooltip: 'Κατάσταση' }
        ];

        $scope.contactColumns = [
            { Caption: 'GRID.TYPE', Field: 'Type' },
            { Caption: 'GRID.NAME', Field: 'Name' },
            { Caption: 'GRID.TITLE', Field: 'Title' },
            { Caption: 'GRID.COMPANY', Field: 'Company' },
            { Caption: 'GRID.ADMINISTRATION', Field: 'Administration' }
        ];

        $scope.providerColumns = [
           { Caption: 'GRID.TYPE', Field: 'Type', Type: 'Lookup', Values: lookupService.providerTypes, Tooltip: 'Τύπος Υποστήριξης' },
           { Caption: 'GRID.NAME', Field: 'Name' },
           { Caption: 'GRID.DESCRIPTION', Field: 'Description' },
           { Caption: 'GRID.PERSONNEL', Field: 'PersonnelCount', Tooltip: 'Πλήθος Προσωπικού' },
           { Caption: 'GRID.ADMINISTRATION', Field: 'Administration' }
        ];

        $scope.reportcolumns = [
            { Caption: 'GRID.TYPE', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'GRID.SUBJECT', Field: 'Subject' },
            { Caption: 'GRID.AUTHOR', Field: 'User' },
            { Caption: 'GRID.DATETIME', Field: 'DateTime', Type: 'DateTime' }
        ];

        $scope.reportactions = lookupService.reports;

        $scope.personcolumns = [
           { Caption: 'GRID.NATIONALITY', Field: 'Nationality' },
           { Caption: 'GRID.NAME', Field: 'Name' },
           { Caption: 'GRID.AGE', Field: 'Age', Type: 'Number' },
           { Caption: 'GRID.SENSITIVE', Field: 'IsSensitive', Type: 'Boolean' },
           { Caption: 'GRID.SENSITIVITY', Field: 'Sensitivity' }
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
            editHousing(housing, true);
        }
        
        $scope.editHousing = function (housing) {
            selectedHousing = housing;
            editHousing(housing, false);
        }

        var editHousing = function (housing, isNew) {
            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/views/housing.html',
                controller: 'HousingCtrl',
                controllerAs: 'housingCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            housing: housing,
                            isNew: isNew
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


        //CONTACT
        $scope.showContact = function (contact) {
            var location = '/contacts/' + contact.Id;
            $location.url(location);
        }

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
        //*************

        //PROVIDER
        $scope.showProvider = function (provider) {
            var location = '/providers/' + provider.Id;
            $location.url(location);
        }

        if (isInsert) {
            $scope.data = {
                Location: {
                    Type: 'Point',
                    Coordinates: [38.5306122, 25.4556341]
                },
                Identities : [],
                Sensitivities : [],
                Procedures : []
            };
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/facilities/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        //*************


        //REPORT
        $scope.showReport = function (report) {
            var location = '/reports/' + report.Type + '/' + $scope.data.Id + '/' + report.Id;
            $location.url(location);
        }

        $scope.createReport = function (type) {
            var location = '/reports/' + type + '/' + $scope.data.Id + '/new';
            $location.url(location);
        }

        $scope.addContact = function () {
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

        //*************
        
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
                if (isInsert)
                    $location.url('/facilities/' + response.data.Id);
                else
                    $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
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
        // SAVE - DELETE
        $scope.makeReport = function () {
            if (isInsert) {
                messageService.showError("Η δομή δεν έχει καταχωρηθεί.");
                return;
            }
            
            $http({
                method: "GET",
                data: $scope.data,
                url: baseUrl + '/facilities/makereport/' + $scope.data.Id
            }).then(function successCallback(response) {
                messageService.saveSuccess();
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        // issue a message to a contact
        $scope.sendMessage = function (fid, rid) {
            $location.url('/reports/6/' + fid + '/new');
        }

        $scope.calcSensibilityCount = function () {
            var count = 0;
            if ($scope.data) {
                $scope.data.Sensitivities.forEach(function (item, index) {
                    count += item.Count;
                })
            }

            return count;
        }

        $scope.calcIdentityCount = function () {
            var count = 0;
            if ($scope.data) {
                $scope.data.Identities.forEach(function (item, index) {
                    count += item.Count;
                })
            }

            return count;
        }

        $scope.calcProcedureCount = function () {
            var count = 0;
            if ($scope.data) {
                $scope.data.Procedures.forEach(function (item, index) {
                    count += item.Count;
                })
            }

            return count;
        }

    });
