'use strict';

angular
    .module('zeusclientApp')
    .controller('HousingCtrl', function ($uibModalInstance, modaldata, lookupService) {

        var vm = this;

        vm.lookup = lookupService;
        vm.housing = modaldata.housing;

        vm.ok = function () {            
            var result = {
                housing: vm.housing
            };
            $uibModalInstance.close(result);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });
