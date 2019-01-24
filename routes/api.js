/**Created by xiaoqi on 2018/11/23*/

let router = require('koa-router')(),
    DB = require('../model/db.js');

router.all("*", async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set('Access-Control-Allow-Origin', "*");
    //ctx.set('Access-Control-Allow-Origin', ctx.headers.origin); // 很奇怪的是，使用 * 会出现一些其他问题
    //设置请求头
    //ctx.set('Access-Control-Allow-Headers', 'content-type');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Access-Token, x-requested-with, x-ui-request, lang');
    // 设置所允许的HTTP请求方法
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH');
    // 是否允许发送Cookie，ture为运行
    ctx.set('Access-Control-Allow-Credentials', true);
    await next();
});

router.post('/doPost', async (ctx) => {
    let tokenId = "";
    //查询token 保存tokenId
    let findTokenResult = await DB.find('vueToken', {});
    if (findTokenResult.length > 0) {
        tokenId = findTokenResult[0]._id;
    }
    //console.log(ctx.request.body); 获取传入的post参数
    //获取用户名
    let username = ctx.request.body.username;
    //查找用户
    let resultFind = await DB.find("vueapi", {"username": username});
    if (resultFind.length > 0) { //用户名查找成功
        //更新token
        let updateTokenResult = await DB.update('vueToken', {"_id": DB.getObjectID(tokenId)}, {"token": username});

        //返回token
        resultFind[0].token = username;
        ctx.body = resultFind[0];
    } else {
        ctx.body = {'message': '用户不存在', 'success': false};
    }

    //ctx.body = {'title':'这是doPost返回的数据'}
});

router.get('/doGet', async (ctx) => {
    //获取token
    let token = ctx.query.token;

    //查询token
    let findTokenResult = await DB.find('vueToken', {});
    //这里应该验证token
    if (findTokenResult.length > 0) {
        if (token === findTokenResult[0].token) {//token一样
            //拉取用户信息
            let resultFind = await DB.find("vueapi", {"username": ctx.query.token});
            if (resultFind.length > 0) {
                ctx.body = resultFind[0]
            } else {
                ctx.body = {'message': '用户不存在', 'success': false};
            }
        }
    }
});

router.get('/transaction/list', async (ctx) => {
    //获取请求头中的token
    //console.log(ctx.request.header['access-token']);
    let token = ctx.request.header['access-token'];

    //查询token
    let findTokenResult = await DB.find('vueToken', {});
    if(findTokenResult.length>0){
        if(token === findTokenResult[0].token){
           let findListResule =  await DB.find('vueList',{});
            ctx.body = findListResule;
        }
    }else{
        ctx.body = {'message':'用户不存在'}
    }

});

//articleList
router.get('/article/list', async (ctx)=>{
    let articleReault = await DB.find('vueArticleList',{});
    if(articleReault.length>0){
        ctx.body = articleReault
    }
})

module.exports = router.routes();