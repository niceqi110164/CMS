/**Created by xiaoqi on 2018/11/23*/

let router = require('koa-router')(),
    tools = require('../../model/tools.js'),
    svgCaptcha = require('svg-captcha'),
    DB = require('../../model/db.js');


router.get("/", async (ctx)=>{
    await ctx.render('admin/login');
});


router.post('/doLogin', async (ctx)=>{
    let code = ctx.request.body.code;
    let json = {};
    json.username = ctx.request.body.username;
    json.password = tools.md5(ctx.request.body.password);


    //console.log(code);
    // console.log(ctx.session.code);

    //判断验证码
    if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()){
        let findResult = await DB.find("userInfo",json);
        //console.log(findResult);
        if(findResult.length>0){
            //更新登录时间
            await DB.update(
                "userInfo",
                {"_id":DB.getObjectID(findResult[0]._id)},
                {"last_time":new Date()}
            );
            //把用户保存到session
            ctx.session.userinfo = findResult[0];
            ctx.redirect(ctx.state.__HOST__+"/admin");
        }else{
            await ctx.render('admin/error',{
                redirect:ctx.state.__HOST__+"/admin/login",
                message:"用户名或者密码错误"
            })
        }
    }else{ //验证码不正确时跳转到login页面
        await ctx.render('admin/error',{
            redirect:ctx.state.__HOST__+"/admin/login",
            message:"验证码错误"
        })
    }

});


//验证码

router.get('/code', async (ctx)=>{
   //ctx.body = "验证码";
    let captcha = svgCaptcha.create(
        {
            size:4,
            fontSize:50,
            width:100,
            height:34,
            background:"#cc9966"
        }
    );
    //生成之后保存验证码
    ctx.session.code = captcha.text;
    //console.log(captcha.text);
    //设置响应头
    ctx.response.type = "image/svg+xml";
    ctx.body = captcha.data;
});


//loginOut
router.get("/loginOut", async (ctx)=>{
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__+"/admin/login");
});

module.exports = router.routes();