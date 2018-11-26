/**Created by xiaoqi on 2018/11/23*/

let router = require('koa-router')();


router.get('/', async (ctx)=>{
   ctx.body = {"title":"这是api"};
});

module.exports = router.routes();