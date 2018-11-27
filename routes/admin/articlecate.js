/**Created by xiaoqi on 2018/11/27*/

let router = require("koa-router")(),
    DB = require("../../model/db.js"),
    tools = require("../../model/tools.js");

//分类首页
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

//分类add
router.get('/add', async (ctx)=>{
    let findResult = await DB.find("articleCate",{"pid":"0"});
    //console.log(findResult);
    if(findResult.length>0){
        await ctx.render("admin/articlecate/add",{
            "title":"添加分类",
            "cateList":findResult
        })
    }


});
//执行添加
router.post('/doAdd', async (ctx)=>{
    //console.log(ctx.request.body);
    let addData = ctx.request.body;

    let insertResult = await DB.insert("articleCate",addData);
    if(insertResult.result.ok){
        await ctx.redirect(ctx.state.__HOST__+"/admin/articlecate");
    }
});
//编辑分类

router.get("/edit", async (ctx)=>{
    //console.log(ctx.query);
    let id =  ctx.query.id;

    let findResultList = await DB.find("articleCate",{"pid":"0"});

    let findResult = await DB.find("articleCate",{"_id":DB.getObjectID(id)});
    if(findResult.length>0){
        await ctx.render("admin/articlecate/edit",{
            "cateList":findResultList,
            "list":findResult[0]
        })
    }
});
//执行doEdit
router.post('/doEdit', async (ctx)=>{
    let editData = ctx.request.body;
    let id = editData.id;
    let title=editData.title;
    let pid=editData.pid;
    let keywords=editData.keywords;
    let status=editData.status;
    let description=editData.description;
    //console.log(editData);

    let updateResult = await DB.update("articleCate",{"_id":DB.getObjectID(id)},{
        title,pid,status,keywords,description
    });

    if(updateResult.result.ok){
        await ctx.redirect(ctx.state.__HOST__+"/admin/articlecate");
    }
});

module.exports = router.routes();