(function() {
    'use strict';

    angular
        .module('app.apiList')
        .controller('ApiListController', ApiListController);

    /** @ngInject */
    function ApiListController($state, $stateParams, initData, apiservice, session, logger) {
        var vm = this;

        vm.currentPage = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
        vm.pageSize = session.getPageSize();
        vm.doPaging = doPaging;

        vm.totalNum = initData.count;
        vm.apis = initData.results;

        function doPaging(text, page) {
            $state.go('api-list', {page: page});
        }
    }
})();
