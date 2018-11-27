/**Created by xiaoqi on 2018/11/23*/

let router = require("koa-router")(),
    DB = require("../../model/db.js");

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
router.get('/edit', async (ctx)=>{
   ctx.body = "编辑用户"
});
router.get('/remove', async (ctx)=>{
   ctx.body = "删除用户"
});

module.exports = router.routes();