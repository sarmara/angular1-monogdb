// 服务端应用程序入口文件
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/angularmongodb");
// 给数据库的连接绑定open和error事件
const db = mongoose.connection;
// on()方法的使用和jquery中类似，第一个参数是事件的名称，第二个参数是回调函数
// open事件数据成功打开连接时执行的事件
db.on('open', () => {
    console.log('数据库打开成功!');
})
// error事件数据连接出错时执行的事件，通过回调函数中的err形参，可得到错误的详细信息
db.on('error', (err) => {
    console.error("连接数据库出错！错误：" + err);
})

// 把数据库中的集合（关系数据库中称为表）映射到到语言中的变量，让访问变量时像访问数据库集合一样
const User = mongoose.model('users', {
    loginName: String,
    realName: String,
    password: String,
    age: { type: Number, defaults: 18 },
    sex: String,
    birthday: String,
    status: String,
    createTime: Date
});

const app = express();

// 配置bodyParser解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 配置静态资源目录
app.use(express.static('public'));

// 一系列相关的接口
app.post('/api/register', (req, res) => {
    // 判断登录名是否已经注册过
    // findOne()方法从数据库中取一条记录，返回是数据对象，count()方法返回记录的个数
    User.findOne({ loginName: req.body.loginName }).count(function (err, count) {
        if (count != 0) {
            res.json({ code: 'error', message: '登录名已存在' });
            return;
        }
    
        var user = {
            loginName: req.body.loginName,
            password: req.body.password,
            realName: "",
            sex: "",
            age: 0,
            birthday: '1970-01-01',
            status: '正常',
            createTime: new Date()
        }
        // create()方法向数据库插入一条或多条记录(可以传数组)
        User.create(user, function (err, u) {
            if (err) {
                res.json({ code: 'error', message: '错误：' + err });
                return;
            }

            res.json({ code: 'success', message: '成功' });
        })

    })

})

app.post('/api/login', (req, res) => {
    User.findOne({
        loginName: req.body.loginName,
        password: req.body.password
    }, function (err, data) {
        if (err) {
            res.json({ code: 'error', message: '查询错误：' + err });
            return;
        }
        if (data != null) {
        // if (data) { // 同上
            // res.cookie("loginName", req.body.loginName);
            res.json({ code: 'success', message: '成功' });
        }
        else {
            res.json({ code: 'error', message: '用户或密码错误' });
        }
    })
});

app.post('/api/addUser', (req, res) => {
    // 验证省略
    const user = {
        loginName: req.body.loginName,
        password: req.body.password,
        realName: req.body.realName,
        age: req.body.age,
        sex: req.body.sex,
        birthday: req.body.birthday,
        status: "正常",
        createTime: new Date()
    };

    User.create(user, (err, u) => {
        if (err) {
            res.json({ code: 'error', message: "保存失败" });
            return;
        }

        res.json({ code: 'success', message: "成功" });
    });
})

app.post('/api/editUser', (req, res) => {
    // 验证省略
    var updateStatement = {
        $set: {
            loginName: req.body.loginName,
            password: req.body.password,
            realName: req.body.realName,
            age: req.body.age,
            sex: req.body.sex,
            birthday: req.body.birthday,
            status: "正常"
        }
    };
    // findByIdAndUpdate()方法取一条记录并更新，第一个参数是集合的主键，第二个参数是更新的语句，第三个参数是回调函数
    User.findByIdAndUpdate(req.body.id, updateStatement, (err, u) => {
        if (err) {
            res.json({ code: 'error', message: "保存失败" });
            return;
        }

        res.json({ code: 'success', message: "成功" });
    });
})

app.get('/api/getUser', (req, res) => {
    var conditions = {}
    var realName = req.query.realName;
    if (realName && realName.length > 0) {
        conditions.realName = {
            '$regex': `.*?${realName}.*?`
        }
    }

    // 当前的页码，如果客户没有传值，默认1，转换成数字型
    var currentPage = req.query.page || 1;
    currentPage = parseInt(currentPage);
    // 每页显示的数据个数
    var pageSize = parseInt(req.query.pageSize);

    User.find(conditions).count(function (err, totalCount) {
        if (err) {
            res.json({ code: 'error', message: '错误' + err });
            return;
        }
        // 获取页面的总页数, totalCount满足条件的数据总数
        var pageCount = Math.ceil(totalCount / pageSize);

        // 在翻页过程，如果到最后一页，让当前页赋值成总页数，如果到第一页，让当前页赋值成第一页的页码
        if (currentPage > pageCount) currentPage = pageCount
        if (currentPage < 1) currentPage = 1

        User.find(conditions)
            // 按姓名倒序
            .sort({ createTime: -1 })
            // 跨过n条数据，开始取
            .skip((currentPage - 1) * pageSize)
            // 限制每页取多少条数据
            .limit(pageSize)
            .exec(function (err, users) {
                if (err) {
                    res.json({ code: 'error', message: '错误' + err });
                    return;
                }
                res.json({
                    code: 'success',
                    message: '成功',
                    users,
                    pageCount,
                    currentPage,
                    pages: getPages(currentPage, pageCount)
                });
            })
    })

})

app.post('/api/remove', (req, res) => {
    // remove()方法从数据库中删除数据，第一个参数是查询条件，第二个参数是回调函数
    User.remove({ _id: req.query.id }, function (err) {
        if (err) {
            res.json({ code: 'error', message: "错误" });
            return;
        }
        res.json({ code: 'success', message: "成功" });
    })
})

// 根据当前的页码和总页数，取页码数组，供分页使用
function getPages(currentPage, pageCount) { // 10  100
    var pages = [currentPage]; // [10]
    var left = currentPage - 1; // 9
    var right = currentPage + 1; // 11
    while (pages.length < 10 && (left >= 1 || right <= pageCount)) {
        if (left >= 1) pages.unshift(left--);
        if (right <= pageCount) pages.push(right++); // [10,11,12]
    }
    return pages;
}

// 启动服务
app.listen('3000', () => {
    console.log('服务已启动，请访问：http://localhost:3000/');
})
