'use strict';

angular
    .module('zeusclientApp')
    .controller('DailyReportCtrl', function ($scope, $http, URL, baseUrl) {

        $http({
            method: 'GET',
            url: baseUrl + '/facilities/getreport/2016/3/15'
        }).then(function successCallback(response) {
            var file = new Blob([data], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

    });
