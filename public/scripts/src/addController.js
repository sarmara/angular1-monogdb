// $http服务是用来向服务端发送请求，是对xmlhttprequest对象的封装，类似于jquery中的ajax请求，主要方法：$http({ method: "get|post", url: "", data: {}, params: {}}), 两个简版方法$http.get(''), $http.post('',{})
// $scope作用域服务，用来控制当前控制器中的变量只能在当前控制器中存活
// $rootScope全局作用域服务（根作用域服务），通过其定义的变量或方法可以跨作用存活。
// $state服务是状态服务，用来控制视图之间的跳转，主要方法：$state.go('路径', { 携带的数据 })
// $stateParams状态参数服务，用来接受$state服务跳转时携带过来的数据
// 注意：$state和$stateParams两个服务必须依赖ui.router模块
// $cookieStore服务用来控制angular视图之间的cookie数据传递，依赖ngCookie模块
userApp.controller('addController', function ($http, $scope, $rootScope, $state, $stateParams, $cookieStore) {
    if(!$cookieStore.get('account')){
        $state.go('login');
    }

    var user = $stateParams.user;
    $scope.loginName = user.loginName;
    $scope.password = user.password;
    $scope.realName = user.realName;
    $scope.age = user.age;
    $scope.sex = user.sex;
    $scope.birthday = user.birthday;

    if($scope.password == null){
        $scope.password = '123456';
    }

    $scope.save = function () {
        var postData = {
            loginName: $scope.loginName,
            password: $scope.password,
            realName: $scope.realName,
            age: $scope.age,
            sex: $scope.sex,
            birthday: $scope.birthday
        }

        var url = "/api/addUser"; // 添加接口地址
        // 如果user存在值，说明是编辑状态
        if(user){
            postData.id = user._id;
            url = "/api/editUser"; // 编辑接口地址
        } 
        $http.post(url, postData)
        .then(function (res) {
            if (res.data.code == "success") {
                $state.go("nav.list");
            }
        });
    }
})