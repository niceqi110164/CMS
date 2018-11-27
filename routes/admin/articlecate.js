/**Created by xiaoqi on 2018/11/27*/

let router = require("koa-router")(),
    DB = require("../../model/db.js"),
    tools = require("../../model/tools.js");


router.get("/", async (ctx)=>{
    //查找数据
    let findResult = await DB.find("articleCate",{});

    //console.log(findResult);
    if(findResult.length>0){
        await ctx.render("admin/articlecate/index",{
            "title":"分类列表",
            "list":tools.cateToList(findResult)
        })
    }
});




module.exports = router.routes();