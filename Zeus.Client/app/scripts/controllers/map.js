'use strict';

/**
 * @ngdoc function
 * @name zeusclientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zeusclientApp
 */
angular.module('zeusclientApp')
  .controller('MapCtrl', function () {
  	var map;
    map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.5306122, lng: 25.4556341},
          zoom: 7
        });
  });
