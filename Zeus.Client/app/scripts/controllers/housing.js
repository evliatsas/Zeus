'use strict';

angular
    .module('zeusclientApp')
    .controller('HousingCtrl', function ($uibModalInstance, modaldata, lookupService, messageService) {

        var vm = this;

        vm.lookup = lookupService;
        vm.housing = modaldata.housing;
        vm.isNew = modaldata.isNew;

        vm.delete = function () {
            messageService.askDeleteConfirmation(deleteHousing);
        }

        var deleteHousing = function () {
            vm.housing.Tag = 'remove';
            vm.ok();
        }

        vm.ok = function () {
            vm.housing.Utilization = Math.round((vm.housing.Attendance / (vm.housing.Capacity * vm.housing.Count))*100);
            var result = {
                housing: vm.housing
            };
            $uibModalInstance.close(result);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });
