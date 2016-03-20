'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, $location, baseUrl, utilitiesService, messageService) {

        $http({
            method: 'GET',
            url: baseUrl + '/facilities'
        }).then(function successCallback(response) {
            $scope.groups = utilitiesService.groupBy(response.data, 'Category');
            initialize();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.view = '';

        $scope.toggleView = function () {
            $scope.view = $scope.view == '' ? 'table' : '';
        }

        $scope.addFacility = function () {
            $location.url('/facilities/new');
        }

        function getCard (facility) {
            var element = document.getElementById(facility.Id);
            var card = angular.element(element);
            return card;
        }

        function isExpanded (card) {
            return card.hasClass('facility-card-expanded');
        }

        $scope.cardStyle = function (facility) {
            var card = getCard(facility);
            if (isExpanded(card)) {
                return {
                    height: '392px'
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
            card.toggleClass('col-lg-4 col-md-6 col-sm-8 col-xs-12');
        }

        $scope.attendanceClass = function (facility) {
            if (facility.Attendance >= facility.Capacity)
                return 'text-danger';
            else if (facility.Attendance >= (0.75 * facility.Capacity))
                return 'text-warning';
            else return 'text-success';
        }

        $scope.issueReport = function (type, id) {
            var location = '/reports/' + type + '/' + id + '/new';
            $location.url(location);
        }

        $scope.totalAttendance = 0;
        $scope.totalCapacity = 0;
        $scope.totalArrivals = 0;
        $scope.totalRations = 0;
        
        function initialize() {
            $scope.groups.forEach(function (group, index) {
                group.items.forEach(function (facility, fIndex) {
                    facility._expanded = 0;
                    $scope.totalAttendance += facility.Attendance;
                    $scope.totalCapacity += facility.Capacity;
                    $scope.totalArrivals += facility.Arrivals;
                    $scope.totalRations += facility.MaxRations;
                });
            });
        }
    });
