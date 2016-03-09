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
            askDeleteConfirmation: askDeleteConfirmation
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

        function askDeleteConfirmation(executionMethod) {
            swal({
                title: "Διαγραφή Εγγραφής",
                text: "Είστε σίγουρος ότι επιθυμείτε την διαγραφή της προβαλλόμενης εγγραφής ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Διαγραφη",
                cancelButtonText: "Ακύρωση",
                closeOnConfirm: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        return executionMethod();
                    }
                }
            );
        }

        function askSaveConfirmation(executionMethod) {
            swal({
                title: "Αποθήκευση Εγγραφής",
                text: "Είστε σίγουρος ότι επιθυμείτε την αποθήκευση της προβαλλόμενης εγγραφής ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Αποθήκευση",
                cancelButtonText: "Ακύρωση",
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