'use strict';

angular
    .module('zeusclientApp')
    .controller('MapCtrl', function ($http, $scope, $compile, $templateRequest, baseUrl, messageService) {
      
      var map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 38.5306122, lng: 25.4556341 },
          zoom: 7
      });

      var infowindow = new google.maps.InfoWindow();
      $scope.facilities = [];
      $scope.markers = [];
      $scope.mnarker = null;
      $scope.facility = null;

      $http({
          method: 'GET',
          url: baseUrl + '/facilities'
      }).then(function successCallback(response) {
          $scope.facilities = response.data;
          $scope.markers = [];
          makeInfoWindow();
          $scope.facilities.forEach(addMarker);
      }, function errorCallback(response) {
          messageService.getFailed(response.error);
      });

      function makeInfoWindow()
      {
          $templateRequest('views/templates/facility-map.html').then(function (template) {
              var content = $compile(template)($scope);
              infowindow.setContent(content[0]);
          }, function () {
              messageService.showError();
          });
      }

      var icon = function (color) {
          return {
              path: "M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zM18 16H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z",
              fillColor: color,
              fillOpacity: 1,
              anchor: new google.maps.Point(12, 25),
              strokeWeight: 0,
              scale: 1.4
          };
      }
            
      function addMarker(element, index, array) {
          if (element == null || element.Location == null) {
              return;
          }
          var myLatLng = { lat: element.Location.Coordinates[0], lng: element.Location.Coordinates[1] };
          var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: element.Name,
              icon: icon('#009688'),
              customInfo: element
          });

          marker.addListener('click', function () {
              $scope.facility = marker['customInfo'];
              $scope.marker = marker;
              $scope.$apply();
              infowindow.open(map, marker);
          });

          if (element.Utilization > 74)
              marker.setIcon(icon('#ff5722'));

          if (element.Utilization > 100)
              marker.setIcon(icon('#f44336'));

          $scope.markers.push(marker);
      }

      $scope.moveMarker = function(facility,marker)
      {
          marker.setDraggable(true);
      }

      $scope.saveMarker = function (facility, marker) {
          var position = marker.getPosition();
          facility.Location.Coordinates = [position.lat(), position.lng()];
          $http({
              method: 'PUT',
              data: facility,
              url: baseUrl + '/facilities'
          }).then(function successCallback(response) {
              marker.setDraggable(false);
              infowindow.close();
          }, function errorCallback(response) {
              messageService.showError(response.data);
          });
      }
  });
