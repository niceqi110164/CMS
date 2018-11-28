/**Created by xiaoqi on 2018/11/16*/
/**
 * 在使用ObjectID的时候需要引入
 * let ObjectID = require('mongodb').ObjectID, //引入ObjectID
 * */


//引入MongoClient 引入配置文件
let MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID, //引入ObjectID
    Config = require('./config.js');

class Db {
    /**@method  : 静态方法 多次实例化不共享的问题
     * @property : Db.instance
     * @return : obj 返回实例化对象
     * */
    static getInstance(){ //单例 多次实例化不共享的问题
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }
    /**@method  : 构造函数
     * @property : this.dbClient
     * */
    constructor(){
        //this.dbClient用于存放db对象;
        this.dbClient = '' ;
        //初始化连接数据库
        this.connect()
    }
    /**@method  : 数据库连接方法
     * @property : 解决数据库多次连接的问题(因为每次连接消耗1s, 所以要保存里连接后的db对象)
     * @params1 : str  url  地址
     * @params2 : str  name  数据库名
     * @return  : obj  返回的是db对象
     * */
    connect(){
        return new Promise((resolve,reject)=>{
            if(!this.dbClient){ // 解决数据库多次连接的问题(因为每次连接消耗1s, 所以要保存里连接后的db对象)
                MongoClient.connect(Config.dbUrl,{useNewUrlParser:true},(err,client)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    //把db对象保存到 this.dbClient
                    this.dbClient = client.db(Config.dbName);
                    resolve(this.dbClient);
                })
            }else{
                resolve(this.dbClient);
            }

        });
    }
    /**@method  : 查找方法
     * @params1 : str  collectionName  表名
     * @params2 : obj  json  查询数据
     * @return  : 返回的是异步数据
     *
     * DB.find("article",{})   => 返回全部数据 (2个参数)
     *
     * DB.find("article",{},{"title":1})  => 只返回带title属性的数据 (3个参数)
     *
     * DB.find('article',{},{"title":1},{  => 返回第二页只带title属性的数据 (4个参数)
     *     page:2,
     *     pageSize:10
     * })
     *
     * db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);
     * */
    find(collectionName,json1,json2,json3){
        let attr =""; //声明属性
        let slipNum = 0; // 声明跳过第几页显示
        let pageSize = 0; // 声明显示的条数
        let page = 0; //声明页数

        if(arguments.length === 2){
            /**
             * db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);
             * 当 attr={}; slipNum=0; pageSize=0; 时查询的是全部的数据
             * */
            attr={};
            slipNum=0;
            pageSize=0;
        }else if(arguments.length === 3){
            /**
             * db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);
             * 当 attr = json2; 时查询的是带json属性的全部的数据
             * */
            attr = json2;
            slipNum = 0;
            pageSize = 0;
        }else if(arguments.length === 4){
            /**
             * db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);
             * 当 attr = json2; 时查询的是带json属性的全部的数据
             * */
            attr = json2;
            page = json3.page || 1; //传入的页数或者初始化为1
            pageSize = json3.pageSize || 20; //传入每页显示的条数或者初始化为20
            slipNum = (page-1)*pageSize; //
        }else{
            console.log("参数错误");
        }

        //异步获取数据要用Promise
        return new Promise((resolve,reject)=>{
            //要获取connect 里面的 db对象
            //使用Promise  this.connect().then()
            this.connect().then((db)=>{
                //获取查询结果
                //let findResult = db.collection(collectionName).find(json);
                let findResult = db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize);

                //把结果转化为数据
                findResult.toArray((err,docs)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(docs);
                })
            })
        })
    }
    /**@method  : 添加方法
     * @params1 : str  collectionName  表名
     * @params2 : obj  json  查询数据
     * @return  : 返回的是异步数据
     * */
    insert(collectionName,json){
        return new Promise((resolve, reject)=>{
            //要获取 connect 里面的 db 对象
            //使用Promise this.connect().then()
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json, (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            }).catch((reason)=>{
                console.log(reason);
            })
        })
    }

    /**@method  : 更新方法
     * @params1 : str  collectionName  表名
     * @params2 : obj  json1  查询数据
     * @params3 : obj  json2  更新的数据
     * @return  : 返回的是异步数据
     * */
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(
                    json1,
                    {$set:json2},
                    (err,result)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    })
            }).catch((reason)=>{
                console.log(reason);
            })
        })
    }

    /**@method  : 删除方法
     * @params1 : str  collectionName  表名
     * @params2 : obj  json  查询数据
     * @return  : 返回的是异步数据
     * */
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).deleteOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                }).catch((reason)=>{
                    console.log(reason);
                })
            })
        })
    }
    /**@method : 获取objectID
     * @params : str   id
     * @return : obj 返回的是objectID对象 (mongodb里面查询 _id 把字符串转换成对象)
     * */
    /**获取ObjectID方法*/
    getObjectID(id){
        return new ObjectID(id);
    }

    /**
     *@method : 获取数据库总数据个数
     *@params : str   json
     * */
    count(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).countDocuments(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }

}

//暴露出 Db的实例
module.exports = Db.getInstance();