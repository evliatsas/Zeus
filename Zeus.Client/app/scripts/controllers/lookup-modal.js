﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('lookupCtrl', function($http, $q, $uibModalInstance, modaldata, baseUrl, lookupService) {
        var vm = this;

        if (modaldata.ignoreTag == true) {
            vm.lookupColumns = [
                { Caption: 'GRID.NAME', Field: 'Description' }
            ];
        } else {
            vm.lookupColumns = [
                { Caption: 'GRID.TYPE', Field: 'Tag' },
                { Caption: 'GRID.NAME', Field: 'Description' }
            ];
        }


        vm.selectedItems = [];

        var httpUrl = baseUrl;
        var findUrl = baseUrl;
        if (modaldata.type == 'Contact') {
            httpUrl += '/common/contacts';
            findUrl += '/contacts/';
            vm.title = 'MODAL.CONTACTS';
        } else if (modaldata.type == 'Facility') {
            httpUrl += '/common/facilities';
            findUrl += '/facilities/';
            vm.title = 'MODAL.FACILITY';
        } else if (modaldata.type == 'Provider') {
            httpUrl += '/common/providers';
            findUrl += '/providers/';
            vm.lookupColumns[0] = { Caption: 'GRID.TYPE', Field: 'Tag', Type: 'Lookup', Values: lookupService.providerTypes };
            vm.title = 'MODAL.PROVIDERS';
        } else if (modaldata.type == 'Person') {
            httpUrl += '/common/persons';
            findUrl += '/persons/';
            vm.title = 'MODAL.PEOPLE';
        }

        $http({
            method: 'GET',
            url: httpUrl
        }).then(function successCallback(response) {
            vm.list = response.data;
            vm.list.forEach(function(element, index, array) {
                for (var item in modaldata.selected) {
                    if (element.Id == modaldata.selected[item].Id) {

                        vm.selectedItems.push(element);
                    }
                }
            })

        }, function errorCallback(response) {
            vm.list = [];
        });

        vm.selectItem = function(item) {
            var index = vm.selectedItems.indexOf(item);
            if (index > -1) {
                vm.selectedItems.splice(index, 1);
            } else {
                vm.selectedItems.push(item);
            }
        }

        vm.ok = function() {
            var promises = [];
            var fullData = [];

            vm.selectedItems.forEach(function (obj, index) {
                promises.push($http({
                        method: 'GET',
                        url: findUrl + vm.selectedItems[index].Id
                    }).then(function successCallback(response) {
                        fullData.push(response.data);
                    }, function errorCallback(response) {
                        //on error do nothing
                    }));
            });
            $q.all(promises).then(function () {
                var result = {
                    selected: fullData
                };
                $uibModalInstance.close(result);
            });

        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    });
