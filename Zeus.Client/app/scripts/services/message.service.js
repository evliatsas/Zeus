(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('messageService', messageService);

    function messageService() {
        var service = {
            showError: showError,
            getFailed: getFailed,
            saveSuccess: saveSuccess,
            deleteSuccess: deleteSuccess,
            askConfirmation: askConfirmation
        };

        function saveSuccess() {
            swal("Αποθήκευση Δεδομένων", "Οι μεταβολές στα δεδομένα αποθηκεύτηκαν με επιτυχία", "success");
        }

        function getFailed(message) {
            swal("Σφάλμα", message ? message : "Παρουσιάστηκε πρόβλημα κατά την προσπάθεια ανάκτησης των δεδομένων. Ελέξτε τη σύνδεσή σας με το διακομιστή.", "error");
        }

        function showError(message) {
            swal("Σφάλμα", message ? message : "Παρουσιάστηκε πρόβλημα κατα την αποθήκευση των μεταβολών", "error");
        }

        function deleteSuccess() {
            swal("Διαγραφή", "Η εγγραφή διαγράφηκε με επιτυχία", "success");
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