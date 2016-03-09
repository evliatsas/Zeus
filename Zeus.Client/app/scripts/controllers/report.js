'use strict';

angular
    .module('zeusclientApp')
    .controller('ReportCtrl', function ($scope, $http, $routeParams, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.facilities = [];
        $scope.providers = [];
        $scope.report = {};
        $scope.reportType = $routeParams.type;

        var isInsert = $routeParams.rid == 'new';
        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/reports/' + $routeParams.rid //the unique id of the report
            }).then(function successCallback(response) {
                $scope.report = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }
        else {
            $scope.report = {};
        }

        $http({
            method: 'GET',
            url: baseUrl + '/facilities/' + $routeParams.fid //the unique id of the facility
            }).then(function successCallback(response) {
                $scope.report.Facility = response.data;
                if ($scope.reportType == "0") {
                    for (var index in response.data.Facility.Providers) {
                        if (response.data.Facility.Providers[index].Type == reportType)
                            $scope.providers.push(response.data.Facility.Providers[index]);
                    }
                }
                else if ($scope.reportType == "2") {
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

            $http({
                method: method,
                data: $scope.report,
                url: baseUrl + '/reports'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteReport = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/reports/' + $scope.report.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteReport);
        }

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
            }
        }

    });
