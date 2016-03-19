'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, $location, baseUrl, utilitiesService, messageService) {

        $http({
            method: 'GET',
            url: baseUrl + '/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
            $scope.groups = utilitiesService.groupBy($scope.facilities, 'Category');
            calcTotals();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.view = '';

        $scope.toggleView = function () {
            $scope.view = $scope.view == '' ? '/table' : '';
            $location.url('/facilities' + $scope.view);
        }

        $scope.addFacility = function () {
            $location.url('/facilities/new');
        }

        var getCard = function (facility) {
            var element = document.getElementById(facility.Id);
            var card = angular.element(element);
            return card;
        }

        var isExpanded = function (card) {
            return card.hasClass('facility-card-expanded');
        }

        $scope.cardStyle = function (facility) {
            var card = getCard(facility);
            if (isExpanded(card)) {
                return {
                    height: 'auto'
                }
            }
            else {
                return {
                    height: '120px' 
                }
            }
        }

        $scope.toggleCard = function (facility) {
            var card = getCard(facility);
            facility._expanded = (facility._expanded == undefined || facility._expanded == 0) ? 1 : 0;
            card.toggleClass('facility-card-expanded');
            card.toggleClass('col-lg-2 col-md-3 col-sm-4 col-xs-6');
            card.toggleClass('col-lg-4 col-md-4 col-sm-12 col-xs-12');
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
