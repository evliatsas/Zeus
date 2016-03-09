'use strict';

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
        var findUrl = baseUrl;
        if (modaldata.type == 'Contact') {
            httpUrl += '/common/contacts';
            findUrl += '/contacts/';
            vm.title = 'Επιλογή Επαφών';
        }
        else if (modaldata.type == 'Facility') {
            httpUrl += '/common/facilities';
            findUrl += '/facilities/';
            vm.title = 'Επιλογή Δομών Φιλοξενίας';
        }
        else if (modaldata.type == 'Provider') {
            httpUrl += '/common/providers';
            findUrl += '/providers/';
            vm.title = 'Επιλογή Προμηθευτή';
        }           

        $http({
            method: 'GET',
            url: httpUrl
        }).then(function successCallback(response) {
            vm.list = response.data;
            vm.list.forEach(function (element, index, array) {
                for (var item in modaldata.selected) {
                    if (element.Id == modaldata.selected[item].Id)
                        vm.selectedItems.push(element);
                }
            })
            
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
            var result = {
                selected: vm.selectedItems
            };
            $uibModalInstance.close(result);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
