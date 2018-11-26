module.exports.getData = function(ctx){
    //返回异步的数据
    return new Promise((resolve,reject)=>{
        try{
            let str = "";
            ctx.req.on("data",(chunk)=>{
                str+=chunk;
            });
            ctx.req.on("end",()=>{
                resolve(str)
            })
        }catch(err){
            reject(err);
        }
    })
}