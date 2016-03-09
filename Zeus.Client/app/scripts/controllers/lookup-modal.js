﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('lookupCtrl', function ( $http, $uibModalInstance, modaldata, baseUrl) {
        var vm = this;

        vm.lookupColumns = [
                    { Caption: 'Τύπος', Field: 'Tag' },
                    { Caption: 'Όνομα', Field: 'Description' }
        ];

        vm.selectedItems = [];

        var httpUrl = baseUrl;
        if (modaldata.type == 'Contact') {
            httpUrl += '/common/contacts';
            vm.title = 'Επιλογή Επαφών';
        }
        else if (modaldata.type == 'Facility') {
            httpUrl += '/common/facilities';
            vm.title = 'Επιλογή Δομών Φιλοξενίας';
        }
        else if (modaldata.type == 'Provider') {
            httpUrl += '/common/providers';
            vm.title = 'Επιλογή Προμηθευτή';
        }           

        $http({
            method: 'GET',
            url: httpUrl
        }).then(function successCallback(response) {
            vm.list = response.data;
            for(var item in modaldata.selected){
                var index = vm.list.indexOf(item);
                if(index > -1)
                    vm.selectedItems.push(vm.list[index]);
            }
        }, function errorCallback(response) {
            vm.list = [];
        });

        vm.selectItem = function (item) {
            var index = vm.selectedItems.indexOf(item);
            if (index > -1) {
                vm.selectedItems.splice(index, 1);
            }
            else {
                vm.selectedItems.push(item);
            }
        }

        vm.ok = function () {
            var fullData = [];
            for (var index in vm.selectedItems) {
                $http({
                    method: 'GET',
                    url: findUrl + vm.selectedItems[index].Id
                }).then(function successCallback(response) {
                    fullData.push(response.data);
                }, function errorCallback(response) {
                    //on error do nothing
                });
            }
            var result = {
                selected: fullData
            };
            $uibModalInstance.close(result);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
