userApp.controller('loginController', function ($scope, $state, $http, $cookieStore) {
    $scope.login = function () {
        $http.post("/api/login", {
            loginName: $scope.loginName,
            password: $scope.password
        }).then(function (res) {
            if (res.data.code == "success") {
                $cookieStore.put('account', $scope.loginName);
                $state.go('nav.list');
            } else {
                alert(res.data.message);
            }
        })
    }
})