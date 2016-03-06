'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
  .controller('MapCtrl', function ($http, $scope, $compile, $templateRequest) {
      
      var map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 38.5306122, lng: 25.4556341 },
          zoom: 7
      });

      var infowindow = new google.maps.InfoWindow();
      $scope.facilities = [];
      $scope.facility = null;

      $http({
          method: 'GET',
          url: 'http://localhost:8080/api/facilities'
      }).then(function successCallback(response) {
          $scope.facilities = response.data;
          makeInfoWindow();
          $scope.facilities.forEach(addMarker);
      }, function errorCallback(response) {
          alert(response.data);
      });

      function makeInfoWindow()
      {
          $templateRequest('/templates/facility-map.html').then(function (template) {
              var content = $compile(template)($scope);
              infowindow.setContent(content[0]);
          }, function () {
              alert("error");
          });
      }
            
      function addMarker(element, index, array) {
          var myLatLng = { lat: element.Location.Coordinates[0], lng: element.Location.Coordinates[1] };
          var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: element.Name,
              icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              customInfo: element
          });

          marker.addListener('click', function () {
              $scope.facility = marker['customInfo'];
              $scope.$apply();
              infowindow.open(map, marker);
          });

          if (element.Utilization > 74)
              marker.setIcon("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");

          if (element.Utilization > 100)
              marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");

          if (element.Utilization == 0) {
              marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
              marker.setDraggable(true);
          }
      }

      $scope.moveMarker = function()
      {

      }
  });
