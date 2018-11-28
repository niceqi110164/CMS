/**Created by xiaoqi on 2018/11/27*/

let router = require("koa-router")(),
    DB = require("../../model/db.js"),
    multer = require('koa-multer'), //上传图片模块(哪里用哪里引入)
    tools = require("../../model/tools.js");


//配置图片上传中间件
let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");//分割成数组
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);//重新命名
    }
});
//加载配置
let upload = multer({storage: storage});


router.get("/", async (ctx) => {

    //数据总数量
    let countResult = await DB.count('article', {});
    // console.log(countResult);
    let page = ctx.query.page || 1;
    let pageSize = 6;
    let totalPages = Math.ceil(countResult / pageSize);
    // console.log(totalPages);

    //查找数据
    let findResult = await DB.find("article", {}, {}, {
        page,
        pageSize,
    });

    //console.log(findResult);
    if (findResult.length > 0) {
        await ctx.render("admin/article/index", {
            "title": "分类列表",
            "list": findResult,
            "pageSize": pageSize,
            "page": page,
            "totalPages": totalPages
        })
    }

});

//添加内容
router.get('/add', async (ctx) => {
    //查询分类数据
    let cateList = await DB.find("articleCate", {});
    //console.log(cateList);

    await ctx.render("admin/article/add", {
        "title": "增加内容",
        "cateList": tools.cateToList(cateList)
    });
});
//执行添加内容
/**
 * upload.single('face')
 * upload 对应上面配置上传图片的upload
 * single("pid") 对应页面中 <input type="file" id="pic"  name="pic" class="col-xs-10 col-sm-5" /> 中的 name属性
 * */
router.post('/doAdd', upload.single('img_url'), async (ctx) => {
    /***
     * 当form 中加入 enctype="multipart/form-data"时
     * 接收数据 用 ctx.req.body
     */

        //console.log(ctx.req.body);
        //获取数据
    let addDate = ctx.req.body;
    addDate.img_url = ctx.req.file ? ctx.req.file.filename : '';
    addDate.last_time = new Date();
    console.log(addDate);

    let insertResult = await DB.insert("article", addDate);
    if (insertResult.result.ok) {
        ctx.redirect(ctx.state.__HOST__ + "/admin/article");
    }
    // ctx.body = {
    //     filename:ctx.req.file?ctx.req.file.filename:'',//返回文件名
    //     body:ctx.req.body
    // }
});

//编辑article
router.get('/edit', async (ctx) => {

    let id = ctx.query.id;

    //查询分类数据
    let cateList = await DB.find("articleCate", {});

    //查找_id对应的数据
    let findResult = await DB.find("article",{"_id":DB.getObjectID(id)});
    //console.log(findResult);

    if(findResult.length>0){
        await ctx.render("admin/article/edit", {
            "title":"编辑内容",
            "list":findResult[0],
            "cateList":cateList,
            "prevPage" :ctx.state.G.prevPage   /*保存上一页的值*/
        })
    }
});
//执行编辑
router.post("/doEdit",upload.single('img_url'), async (ctx)=>{

    //获取数据
    let addDate = ctx.req.body;
    let addDate1 = ctx.req.body;
    let id = addDate.id;
    addDate.last_time = new Date();
    addDate.img_url = ctx.req.file ? ctx.req.file.filename : '';
    console.log(addDate);

    if(addDate.img_url){
        await DB.update("article",{"_id":DB.getObjectID(id)},addDate)
    }else{
        await DB.update("article",{"_id":DB.getObjectID(id)},addDate1)
    }

    //跳转
    if(addDate.prevPage){
        ctx.redirect(addDate.prevPage);

    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
    }
});


module.exports = router.routes();