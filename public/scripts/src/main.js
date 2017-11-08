// 定义应用程序模块入口，并配置路由
// ngCookies模块是angular中的cookie操作模块，只能用来控制通过angular操作的cookie
// 有三个主要方法：put(key,value) 设置cookie, get(key) 获取cookie, remove(key) 移除cookie
// ui.router是第三方的路由模块，比angular自带的ngRoute路由模块功能更强大，可以把多个视图模板分离成n个小文件，便于管理
var userApp = angular.module('userApp', ['ui.router', 'ngCookies']);

// 配置路由
// $stateProvider服务是状态的提供者
// $urlRouterProvider服务是url路由提供者
userApp.config(function($stateProvider, $urlRouterProvider){
    // 通过$stateProvider的state()方法可配置不同的状态，让满足不同状态的URL经过时，选择不同的视图模板进行展示，第一个参数是状态名称，第二个参数是状态的可选项（主要包括一些配置信息）
    // 常用的属性：url，匹配的url；templateUrl，匹配到url后使用的视图模板路径；controller，视图模板所对应的控制器（也可以在视力中指定，但注意视图和此处只能保留一处）
    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "login.html",
        controller: "loginController"
    })
    .state("register", {
        url: "/register",
        templateUrl: "register.html",
        controller: "registerController"
    })
    .state("nav", {
        url: "/nav",
        templateUrl: "nav.html"
    })
    .state('nav.list', {
        url: "/list",
        templateUrl: "list.html",
        controller: "listController"
    }).state('nav.add', {
        url: "/add",
        templateUrl: "add.html",
        controller: "addController",
        params: { user: "" }
    });
    // 配置默认地址，指定应用程序刚启动时跳转到视图, 下面两行语句效果相同
    $urlRouterProvider.when("", "/login");
    // $urlRouterProvider.otherwise('/nav/list');
})
