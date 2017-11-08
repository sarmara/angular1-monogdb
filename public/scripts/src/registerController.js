userApp.controller('registerController', function ($scope, $http, $cookieStore, $state) {
    $scope.register = function () {
        if(!$scope.loginName || !$scope.password || !$scope.confirmPassword){
            alert('请输入登录名，密码，确认密码');
            return;
        }

        if($scope.password != $scope.confirmPassword){
            alert('两次输入的密码不一致');
            return;
        }

        $http.post('/api/register', {
            loginName: $scope.loginName,
            password: $scope.password,
            confirmPassword: $scope.confirmPassword
        }).then(function (res) {
            if (res.data.code == "success") {
                $cookieStore.put('account', $scope.loginName);
                $state.go('nav.list');
            } else {
                alert(res.data.message);
            }
        })
    }
});