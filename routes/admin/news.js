/**Created by xiaoqi on 2018/11/23*/
let router = require("koa-router")();

router.get('/', async (ctx)=>{
    ctx.body = "新闻管理"
});
router.get('/newsList', async (ctx)=>{
    ctx.body = "新闻列表"
});
router.get('/newsEdit', async (ctx)=>{
    ctx.body = "编辑新闻"
});

module.exports = router.routes();