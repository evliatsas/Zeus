(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('messageService', messageService);

    function messageService() {
        var service = {
            deleteSuccess: deleteSuccess,
            showError: showError,
            saveSuccess: saveSuccess,
            askConfirmation: askConfirmation
        };

        function saveSuccess() {
            swal("Αποθήκευση Δεδομένων", "Οι μεταβολές στα δεδομένα αποθηκεύτηκαν με επιτυχία.", "success");
        }

        function showError() {
            swal("Αποθήκευση Δεδομένων", "Παρουσιάστηκε πρόβλημα κατα την αποθήκευση των μεταβολών", "error");
        }

        function deleteSuccess() {
            swal("Διαγραφή Εγγράφου", "Η εγγραφή διαγράφηκε.", "success");
        }

        function askConfirmation(executionMethod) {
            swal({
                title: "Διαγραφή Εγγράφου",
                text: "Είστε σίγουρος ότι επιθυμείτε την διαγραφή της προβαλλόμενης εγγραφής ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Διαγραφη",
                cancelButtonText: "Ακυρωση",
                closeOnConfirm: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        return executionMethod();
                    }
                }
            );
        }

        return service;
    }
})();