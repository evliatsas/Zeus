'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, $location, baseUrl, messageService) {

        $http({
            method: 'GET',
            url: baseUrl + '/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
            calcTotals();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.toggleView = function () {
            $location.url("/facilities");
        }

        $scope.addFacility = function () {
            $location.url("/facilities/new");
        }

        $scope.attendanceClass = function (facility) {
            if (facility.Attendance >= facility.Capacity)
                return 'text-danger';
            else if (facility.Attendance >= (0.75 * facility.Capacity))
                return 'text-warning';
            else return 'text-success';
        }

        $scope.totalAttendance = 0;
        $scope.totalCapacity = 0;
        $scope.totalArrivals = 0;
        $scope.totalRations = 0;
        var calcTotals = function () {
            angular.forEach($scope.facilities, function (value, key) {
                $scope.totalAttendance += value.Attendance;
                $scope.totalCapacity += value.Capacity;
                $scope.totalArrivals += value.Arrivals;
                $scope.totalRations += value.MaxRations;
            });
        }
    });
