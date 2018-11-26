/**Created by xiaoqi on 2018/11/23*/

let router = require('koa-router')();

router.get('/', async (ctx)=>{

    await ctx.render("default/index",{
        "title":"index首页"
    });
    //ctx.body = "这是前台首页";
});

router.get("/about", async (ctx)=>{
   await ctx.render("default/about",{
       "title":"这是about"
   })
});

module.exports = router.routes();