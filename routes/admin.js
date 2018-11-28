/**Created by xiaoqi on 2018/11/23*/


let router = require("koa-router")(),
    user = require('./admin/user.js'),
    manager = require('./admin/manager.js'),
    login = require('./admin/login.js'),
    url = require('url'),
    code = require('svg-captcha'),
    ueditor=require('koa2-ueditor'),
    articlecate = require('./admin/articlecate.js'),
    article = require('./admin/article.js'),
    index = require('./admin/index.js');


//配置中间件 获取url地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);
    //配置全局变量
    ctx.state.__HOST__ = "http://"+ctx.request.header.host;

    let pathname = url.parse(ctx.request.url).pathname;
    pathname = pathname.substring(1);
    //console.log(pathname);

    //左侧菜单选中
    let splitUrl = pathname.split('/');
    ctx.state.G = {
        url : splitUrl,
        //userinfo:ctx.session.userinfo
        prevPage:ctx.request.headers['referer']   /*上一页的地址*/
    };

    //判断权限
    if(ctx.session.userinfo){
        await next();
    }else{ //没有登录跳转到登录页面
        if(pathname == 'admin/login' || pathname == 'admin/login/doLogin' || pathname == 'admin/login/code'){
            await next();
        }else{
            ctx.redirect("/admin/login");
        }
    }
});

router.use(index);

router.use('/articlecate', articlecate);
router.use('/article', article);
router.use('/manager', manager);
router.use('/login', login);
// router.use('/news', news);


//注意上传图片的路由 editor.config.js配置图片post的地址

router.all('/editorUpload', ueditor(['static', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]));

module.exports = router.routes();