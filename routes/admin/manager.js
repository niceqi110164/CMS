/**Created by xiaoqi on 2018/11/23*/

let router = require("koa-router")(),
    DB = require("../../model/db.js"),
    tools = require("../../model/tools.js");

router.get('/', async (ctx)=>{
    //获取用户数据

    let findResult = await DB.find("userInfo",{});
    //console.log(findResult);
    if(findResult.length>0){
        await ctx.render("admin/manager/list",{
            "title":"用户管理",
            "list":findResult
        });
    }
});
router.get('/add', async (ctx)=>{
    await ctx.render("admin/manager/add",{
        "title":"增加用户"
    });
});

router.post('/doAdd', async (ctx)=>{
    //console.log(ctx.request.body);
    //1获取表单提交的数据
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let status = ctx.request.body.status;

    //2验证表单数据是否合法
    if(!/\w{3,20}/.test(username)){
        await ctx.render('admin/error',{
            message:"用户名不合法",
            redirect: ctx.state.__HOST__+"/admin/manager/add"
        })
    }else if(password !== rpassword){//判断两次密码是否输入一致
        await ctx.render('admin/error',{
            message:"两次输入的密码不一致",
            redirect: ctx.state.__HOST__+"/admin/manager/add"
        });
    }else{
        //3 数据库查询当前管理员是否存在
        let findResult = await DB.find("userInfo",{"username":username});

        //如果存在
        if(findResult.length>0){
            //渲染错误页面
            await ctx.render('admin/error',{
                message:"用户已存在",
                redirect: ctx.state.__HOST__+"/admin/manager/add"
            })
        }else{// 不存在就添加
            let insertResult = await DB.insert(
                'userInfo',
                {"username":username,"password":tools.md5(password),"last_time":new Date(),"status":status}
            );
            //添加成功页面跳转
            if(insertResult.result.ok){
                ctx.redirect(ctx.state.__HOST__+"/admin/manager");
            }
        }
    }
});

//修改用户
router.get('/edit', async (ctx)=>{
    //console.log(ctx.query);
    let id = ctx.query.id;

    let findResult = await DB.find("userInfo",{"_id":DB.getObjectID(id)});
    //console.log(findResult);
    if(findResult.length>0){
        await ctx.render("admin/manager/edit",{
            "title":"编辑用户",
            "list":findResult[0]
        });
    }
});

//提交修改
router.post('/doEdit', async (ctx)=>{
    //获取post传值
    let id = ctx.request.body.id;
    let username = ctx.request.body.username;
    let status = ctx.request.body.status;

    //更新数据
    let updateResult = await DB.update("userInfo",{"_id":DB.getObjectID(id)},{"username":username,"status":status});

    if(updateResult.result.ok){//更新成功
        //页面跳转到用户列表
        ctx.redirect(ctx.state.__HOST__+"/admin/manager");
    }else{
        ctx.redirect(ctx.state.__HOST__+"/admin/manager/edit");
    }
});


module.exports = router.routes();