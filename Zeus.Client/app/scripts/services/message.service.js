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

        function showInfo(message) {
            swal({
                title: "Info",
                text: message,
                type: "info",
                confirmButtonClass: "btn btn-raised btn-info"
            });
        }

        function saveSuccess() {
            swal({
                title: "Αποθήκευση Δεδομένων",
                text: "Οι μεταβολές στα δεδομένα αποθηκεύτηκαν με επιτυχία",
                type: "success",
                confirmButtonClass: "btn btn-raised btn-success"
            });
        }

        function getFailed(message) {
            swal({
                title: "Σφάλμα",
                text: message ? message : "Παρουσιάστηκε πρόβλημα κατά την προσπάθεια ανάκτησης των δεδομένων. Ελέξτε τη σύνδεσή σας με το διακομιστή.",
                type: "error",
                confirmButtonClass: "btn btn-raised btn-warning"
            });
        }

        function showError(message) {
            swal({
                title: "Σφάλμα",
                text: message ? message : "Παρουσιάστηκε πρόβλημα κατα την αποθήκευση των μεταβολών",
                type: "error",
                confirmButtonClass: "btn btn-raised btn-warning"
            });
        }

        function deleteSuccess() {
            swal({
                title: "Διαγραφή",
                text: "Η εγγραφή διαγράφηκε με επιτυχία",
                type: "success",
                confirmButtonClass: "btn btn-raised btn-success"
            });
        }

        function askDeleteConfirmation(executionMethod) {
            swal({
                title: "Διαγραφή Εγγραφής",
                text: "Είστε σίγουρος ότι επιθυμείτε την διαγραφή της προβαλλόμενης εγγραφής ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn btn-raised btn-danger",
                confirmButtonText: "ΔΙΑΓΡΑΦΗ",
                cancelButtonClass: "btn btn-raised btn-default",
                cancelButtonText: "ΑΚΥΡΩΣΗ",
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