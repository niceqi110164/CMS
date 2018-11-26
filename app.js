
let  Koa = require("koa"),
     router = require('koa-router')(),
     views = require('koa-views'),
     bodyparser = require('koa-bodyparser'),
     static = require('koa-static'),
     render = require('koa-art-template'),
     path = require("path"),

     session = require("koa-session"),
     DB= require("./model/db.js"),
     common = require("./model/common.js");

let app = new Koa();


//引入 koa-veiws配置中间件
app.use(views(
    'views',
    {
        extension: 'html'
    }
));
//配置bodyparser中间件
app.use(bodyparser());
//配置静态web服务中间件
app.use(static(__dirname+"/static"));
//配置art-template 模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production',  //是否开启调试模式
    dateFormat: dateFormat=function(value){
        return sd.format(value, "YYYY-MM-DD HH:mm:ss")
    }/**扩展模板里面的方法*/
});
//设置session提供的中间件
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

let index = require('./routes/index.js');
let admin = require('./routes/admin.js');
let api = require('./routes/api.js');


//后台首页
router.use('/admin', admin);
//前台首页
router.use(index);
//api
router.use('/api', api);


app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8003,()=>{
    console.log("server running at http://127.0.0.1:8003");
});

