userApp.controller('listController', function ($rootScope, $scope, $state, $http, $window, $cookieStore) {
    if(!$cookieStore.get('account')){
        $state.go('login');
    }

    $scope.search = function (page) {
        $http({
            method: "get",
            url: "/api/getUser",
            params: {
                realName: $scope.realName,
                page: page || 1,
                pageSize: 10
            }
        }).then(function (res) {
            $scope.userLists = res.data.users;
            $scope.pages = res.data.pages;
            $scope.pageCount = res.data.pageCount;
            $scope.currentPage = res.data.currentPage;
        })
    }

    $scope.edit = function (index) {
        $state.go('nav.add', { user: $scope.userLists[index]});
    }
    $scope.remove = function (id) {
        if($window.confirm("确定要删除此条数据吗？")){
            $http({
                method: "post",
                url: "/api/remove",
                params: { id }
            }).then(function(res){
                $scope.search(1);
            })
        }
    }

    $scope.isActive = function (page) {
        return page === $scope.currentPage;
    }

    $scope.noNext = function () {
        return $scope.currentPage === $scope.pageCount;
    }

    $scope.noPrevious = function () {
        return $scope.currentPage === 1;
    }

    if (!$scope.userLists) {
        $scope.search(1);
    }
})