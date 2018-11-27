/**Created by xiaoqi on 2018/11/26*/

let router = require("koa-router")(),
    DB = require("../../model/db.js");

router.get('/', async (ctx)=>{
    await ctx.render("admin/index",{
        "title":"后台首页"
    });
});
router.get('/changeStatus', async (ctx)=>{
    //console.log(ctx.query);
    let collectionName = ctx.query.collectionName;
    let attr = ctx.query.attr;
    let id = ctx.query.id;
    let json = {};
    //查找数据
    let data= await DB.find(collectionName,{"_id":DB.getObjectID(id)});
    //console.log(data);
    if(data.length>0){// 数据存在
        if(data[0][attr]=="1"){ //更新属性
            json[attr] = "0";
        }else{
            json[attr]= "1";
        }
        //更新数据
        let updateResult = await DB.update(
            collectionName,
            {"_id":DB.getObjectID(id)},
            json
        );

        //onsole.log(updateResult.result.ok);
        if(updateResult.result.ok){
            ctx.body = {"message":"更新成功","success":true}
        }else{
            ctx.body = {"message":"更新失败","success":false}
        }

    }else{//数据不存在
        ctx.body = {"message":"更新失败,参数错误","success":false}
    }
});


//删除
router.get("/remove", async (ctx)=>{
    try {
        //console.log(ctx.query);
        //获取get传值id
        let id = ctx.query.id;
        let collectionName=ctx.query.collectionName;
        //用过id 查询数据库
        let removeResult = await DB.remove(collectionName,{"_id":DB.getObjectID(id)});

        if(removeResult.result.ok){//删除成功
            //页面跳转到用户列表
            ctx.redirect(ctx.state.G.prevPage);
        }
    }catch(err){
        ctx.redirect(ctx.state.G.prevPage);
    }


});


module.exports = router.routes();