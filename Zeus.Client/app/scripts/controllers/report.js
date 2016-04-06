'use strict';

angular
    .module('zeusclientApp')
    .controller('ReportCtrl', function ($rootScope, $scope, $http, $routeParams, $location, moment, lookupService, messageService, baseUrl, utilitiesService) {

        $scope.lookup = lookupService;
        $scope.facilities = [];
        $scope.housings = [];
        $scope.providers = [];
        $scope.report = {};
        $scope.reportType = $routeParams.type;

        $scope.report.RationsRequired = true;
        $scope.formatDateTime = utilitiesService.formatDateTime;

        var isInsert = $routeParams.id == 'new';
        $scope.IsNew = isInsert;

        var getReportType = function () {
            switch ($scope.reportType) {
                case "0":
                    return 'FeedingReport';
                case "1":
                    return 'HousingReport';
                case "2":
                    return 'MovementReport'
                case "3":
                    return 'ProblemReport';
                case "4":
                    return 'RequestReport';
                case "5":
                    return 'SituationReport';
                case "6":                   
                    return 'Message';
                case "7":
                    return 'HealthcareReport';
            }
        }

        $scope.goBack = function () {
            var previous = $rootScope.previousRoot;
            if (previous.$$route.controllerAs == "facilities") {
                $location.url('/facilities');
            }
            else if (previous.$$route.controllerAs == "facility") {
                $location.url('/facilities/' + previous.params.id + '?tab=3');
            }
            else { //default to reports list
                $location.url('/reports/' + previous.params.type);
            }
        }

        $scope.addIdentity = function () {
            $scope.report.Identities.push({
                Nationality: "Άγνωστη",
                Count: 0
            });
        }

        $scope.addSensitivity = function () {
            $scope.report.Sensitivities.push({
                Nationality: "Ασυνόδευτοι Ανήλικοι",
                Count: 0
            });
        }

        $scope.addProcedure = function () {
            $scope.report.Procedures.push({
                Type: "",
                Nationality: "Άγνωστη",
                Count: 0
            });
        }

        $scope.calcSensibilityCount = function () {
            var count = 0;
            for (var i in $scope.report.Sensitivities)
                count += $scope.report.Sensitivities[i].Count;

            return count;
        }

        $scope.calcIdentityCount = function () {
            var count = 0;
            for (var i in $scope.report.Identities)
                count += $scope.report.Identities[i].Count;

            return count;
        }

        $scope.calcProcedureCount = function () {
            var count = 0;
            for (var i in $scope.report.Procedures)
                count += $scope.report.Procedures[i].Count;

            return count;
        }
       
        $scope.save = function () {
            $scope.report.Type = $scope.reportType;
            var rt = getReportType();
            $scope.report._t = [
                'Report',
                rt
            ]
            if (isInsert) {
                // Create report
                var method = 'POST';
            }
            else {
                // Update report
                var method = 'PUT';
            }

            var obj = { "$type": 'Zeus.Entities.' + getReportType() + ', Zeus.Entities' };

            for (var prop in $scope.report) {
                obj[prop] = $scope.report[prop];
            }
                        
            $http({
                method: method,
                data: obj,
                url: baseUrl + '/reports'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.goBack();
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        var deleteReport = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/reports/' + $scope.report.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $scope.goBack();
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteReport);
        }

        $scope.archive = function () {
            $http({
                method: 'GET',
                url: baseUrl + '/reports/archive/' + $scope.report.Id //archive report
            }).then(function successCallback(response) {
                $scope.report.IsArchived = response.data;
                $scope.goBack();
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        $scope.getLookup = function (type) {
            var typeName = "facilities";

            if (type == "0")
                typeName = "facilities";
            else if (type == "1")
                typeName = "providers";
            else if (type == "2")
                typeName = "contacts";

            $http({
                method: 'GET',
                url: baseUrl + '/common/' + typeName
            }).then(function successCallback(response) {
                $scope.lookupList = response.data;
            }, function errorCallback(response) {
                $scope.lookupList = [];
            });
        }

        var load = function () {
            $http({
                method: 'GET',
                url: baseUrl + '/facilities/' + $routeParams.fid //the unique id of the facility
            }).then(function successCallback(response) {
                $scope.report.Facility = response.data;
                $scope.report.FacilityId = response.data.Id;
                if ($scope.reportType == "0") {
                    for (var index in response.data.Providers) {
                        if (response.data.Providers[index].Type == "3") //type of facility provider
                            $scope.providers.push(response.data.Providers[index]);
                    }
                }
                else if ($scope.reportType == "7") {
                    for (var index in response.data.Providers) {
                        if (response.data.Providers[index].Type == "0") //type of healthcare provider
                            $scope.providers.push(response.data.Providers[index]);
                    }
                }
                else if ($scope.reportType == "1") { //housing report
                    //fill the available housings
                    $scope.housings = response.data.Housings;
                }
                else if ($scope.reportType == "2" || $scope.reportType == "6") {
                    $http({
                        method: 'GET',
                        url: baseUrl + '/common/facilities' //lookup facilities
                    }).then(function successCallback(response) {
                        $scope.facilities = response.data;
                    }, function errorCallback(response) {
                        $scope.facilities = [];
                        messageService.getFailed(response.error);
                    });
                }
            }, function errorCallback(response) {
                $scope.report.Facility = {};
            })
            .then(function () {
                if (!isInsert) {
                    $http({
                        method: 'GET',
                        url: baseUrl + '/reports/' + $routeParams.id //the unique id of the report
                    }).then(function successCallback(response) {
                        $scope.getLookup(response.data.RecipientType);
                        $scope.report = response.data;
                        if ($scope.reportType == "1") {
                            $scope.housingIndex = getHousingIndex();
                            if ($scope.housingIndex>-1)
                                $scope.housingAttendance = $scope.housings[$scope.housingIndex].Attendance;
                            else
                                $scope.housingAttendance = 0
                        }
                    }, function errorCallback(response) {
                        messageService.getFailed(response.error);
                    });
                }
                else {
                    if ($scope.reportType == "5") {
                        $scope.report = {
                            Identities: [
                                {
                                    Nationality: "Άγνωστη",
                                    Count: 0
                                }
                            ],
                            Sensitivities: [],
                            Procedures: []
                        };
                    }
                    else if ($scope.reportType == "6") {
                        $scope.getLookup(0);
                        $scope.report.RecipientType = 0;
                    }
                    else if ($scope.reportType == "1") {
                        if ($scope.housings.length > 0) {
                            $scope.housingIndex = 0;
                            $scope.housingAttendance = 0
                        }
                    }
                    else if ($scope.reportType == "7") {
                        $scope.report.Personnel = [];
                        $scope.report.Items = [];
                    }
                }
            });
        }

        load();

        $scope.onSelectedHouseIndex = function () {
            if ($scope.housingIndex == -1)
                $scope.report.Housing = {};
            else
                $scope.report.Housing = $scope.housings[$scope.housingIndex];
        }

        $scope.onSelectedHouseAttendance = function () {
            $scope.report.Housing.Attendance = $scope.housingAttendance;
        }

        var getHousingIndex = function () {
            for (var i in $scope.housings) {
                if ($scope.housings[i].Type == $scope.report.Housing.Type && $scope.housings[i].Capacity == $scope.report.Housing.Capacity)
                    return i;
            }

            return -1;
        }

        $scope.addPersonnel = function () {
            $scope.report.Personnel.push({});
        }

        $scope.addItem = function () {
            $scope.report.Items.push({});
        }
    });
