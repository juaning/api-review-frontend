(function() {
    'use strict';

    angular
        .module('app.apiEditor')
        .controller('ApiEditorController', ApiEditorController);

    /** @ngInject */
    function ApiEditorController($state, $stateParams, dialogs, reviewservice,
        apiservice, userservice, tagservice, ratingservice, session, toastr, logger) {
        var vm = this;

        vm.isEditMode = ($state.current.name == 'api-item-edit');
        vm.submit = submitAPI;
        vm.cancel = cancelEdit;
        vm.api = {
            'name': '',
            'description': '',
            'link': ''
        };

        // Use API stored in session if valid when editing review
        if (vm.isEditMode) {
            // vm.api = session.getCurrentAPI();

            // if (vm.api == null || vm.api.id != $stateParams.id) {
                apiservice.getById($stateParams.id)
                    .then(getAPISuccessful, getAPIFailed);

                function getAPISuccessful(result) {
                    vm.api = result;
                    // session.setCurrentAPI(vm.api);
                }

                function getAPIFailed(error) {
                    $state.go('api-list');
                    toastr.error('Failed to retrieve the API. Please try again.');
                }
            // }
        }

        function submitAPI() {
            vm.dataLoading = true;
            logger.log(vm.api);
            if (vm.isEditMode) {
                apiservice.update(vm.api)
                    .then(updateAPISuccessful, submitAPIFailed);
            } else {
                apiservice.create(vm.api)
                    .then(createAPISuccessful, submitAPIFailed);
            }

            function createAPISuccessful(result) {
                $state.go('api-item-view', {id: result.id});
                toastr.success('Successfully created!', 'New API');
            }

            function updateAPISuccessful(result) {
                $state.go('api-item-view', {id: vm.api.id});
                toastr.success('API successfully updated!');
            }

            function submitAPIFailed(result) {
                vm.dataLoading = false;
                toastr.error('Failed to submit API. Please try again.');
            }
        }

        function cancelEdit() {
            $state.go('api-item-view', {id: vm.api.id});
            logger.info('Editing cancelled');
        }
    }
})();
