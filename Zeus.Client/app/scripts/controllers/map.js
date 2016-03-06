'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
  .controller('MapCtrl', function ($http, $scope, $compile) {
      var map;
      map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 38.5306122, lng: 25.4556341 },
          zoom: 7
      });

      $http({
          method: 'GET',
          url: 'http://localhost:8080/api/facilities'
      }).then(function successCallback(response) {
          $scope.facilities = response.data;
          $scope.facilities.forEach(addMarker);
      }, function errorCallback(response) {
          alert(response.data);
      });
            
      function addMarker(element, index, array) {
          var myLatLng = { lat: element.Location.Coordinates[0], lng: element.Location.Coordinates[1] };
          var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: element.Name,
              icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          });
          marker.addListener('click', function () {
              var infowindow = new google.maps.InfoWindow();
              var content = '<div ng-include src="\'/templates/facility-card.html\'"></div>';
              infowindow.setContent(content);
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
  });
