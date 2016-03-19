'use strict';

angular
    .module('zeusclientApp')
    .controller('MapCtrl', function($http, $scope, $compile, $templateRequest, baseUrl, messageService) {

        var markers = [];

        var styles = [{
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }];

        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 38.5306122, lng: 25.4556341 },
            zoom: 7
        });


        map.setOptions({ styles: styles });

        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });


        var infowindow = new google.maps.InfoWindow();
        $scope.facilities = [];
        $scope.markers = [];

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

        function makeInfoWindow() {
            $templateRequest('views/templates/facility-map.html').then(function(template) {
                var content = $compile(template)($scope);
                infowindow.setContent(content[0]);
            }, function() {
                messageService.showError();
            });
        }

        var icon = function(color) {
            return {
                path: "M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zM18 16H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z",
                fillColor: color,
                fillOpacity: 1,
                anchor: new google.maps.Point(12, 25),
                strokeWeight: 0,
                scale: 1.4
            };
        }

        function getLabel(element) {
            var label = '<div>' + element.Attendance + '/' + element.MaxCapacity + '</div>';

            label += "<div>";

            if (element.HasHealthcare == true)
                label += '<strong><span class="text-primary">Y</span></strong>';
            else
                label += '<strong><span class="text-danger">Y</span></strong>';

            label += '<span> ' + element.HealthcareReportsCount + ' </span>';
            label += '<span> ' + element.MaxRations + ' </span>';

            label += "</div>";
            return label;
        }

        // totals
        $scope.totalAttendance = 0;
        $scope.totalCapacity = 0;
        $scope.totalArrivals = 0;
        $scope.totalRations = 0;

        function addMarker(element, index, array) {
            //calc totals
            $scope.totalAttendance += element.Attendance;
            $scope.totalCapacity += element.Capacity;
            $scope.totalArrivals += element.Arrivals;
            $scope.totalRations += element.MaxRations;

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

            marker.addListener('click', function() {
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
            addLabel(element, myLatLng);
        }

        $scope.moveMarker = function(facility, marker) {
            marker.setDraggable(true);
        }

        $scope.saveMarker = function(facility, marker) {
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

        var mapLabels = [];
        var labelsVisible = true;

        function addLabel(element, myLatLng) {
            var myOptions = {
                content: getLabel(element),
                boxStyle: {
                    border: "1px solid black",
                    backgroundColor: "black",
                    color: "white",
                    opacity: 0.6,
                    textAlign: "center",
                    fontSize: "8pt",
                    width: "60px"
                },
                disableAutoPan: true,
                pixelOffset: new google.maps.Size(-30, 0),
                position: new google.maps.LatLng(myLatLng.lat, myLatLng.lng),
                closeBoxURL: "",
                isHidden: false,
                pane: "mapPane",
                enableEventPropagation: true
            };

            var ibLabel = new InfoBox(myOptions);
            ibLabel.open(map);
            mapLabels.push(ibLabel);
        };

        $scope.toggleLabels = function() {
            labelsVisible = !labelsVisible;
            mapLabels.forEach(function(element, index, array) {
                if (labelsVisible)
                    element.show();
                else
                    element.hide();
            });
        }
    });