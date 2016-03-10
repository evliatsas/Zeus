'use strict';

angular
    .module('zeusclientApp')
    .controller('HousingCtrl', function ($uibModalInstance, modaldata, lookupService) {

        var vm = this;

        vm.lookup = lookupService;
        vm.housing = modaldata.housing;

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
