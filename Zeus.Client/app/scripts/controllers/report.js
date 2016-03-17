'use strict';

angular
    .module('zeusclientApp')
    .controller('ReportCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.facilities = [];
        $scope.providers = [];
        $scope.report = {};
        $scope.reportType = $routeParams.type;

        $scope.report.RationsRequired = true;

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
                    return 'HealthcareProblemReport';
            }
        }

        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/reports/' + $routeParams.id //the unique id of the report
            }).then(function successCallback(response) {
                $scope.report = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }
        else
        {
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
        
        $http({
            method: 'GET',
            url: baseUrl + '/facilities/' + $routeParams.fid //the unique id of the facility
            }).then(function successCallback(response) {
                $scope.report.Facility = response.data;
                $scope.report.FacilityId = response.data.Id;
                if ($scope.reportType == "0") {
                    for (var index in response.data.Providers) {
                        if (response.data.Providers[index].Type == $scope.reportType)
                            $scope.providers.push(response.data.Providers[index]);
                    }
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
        });


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
                $location.url('/reports/' + response.data.Type + '/' + response.data.FacilityId + '/' + response.data.Id);
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
                $location.url('/facilities/' + $scope.report.FacilityId);
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
                $location.url('/reports/archive');
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

    });
