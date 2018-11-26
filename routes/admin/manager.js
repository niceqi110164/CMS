/**Created by xiaoqi on 2018/11/23*/

let router = require("koa-router")();

router.get('/', async (ctx)=>{
    await ctx.render("admin/manager/list",{
        "title":"用户管理"
    });
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