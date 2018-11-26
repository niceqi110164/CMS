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
     * */
    find(collectionName,json){
        //异步获取数据要用Promise
        return new Promise((resolve,reject)=>{
            //要获取connect 里面的 db对象
            //使用Promise  this.connect().then()
            this.connect().then((db)=>{
                //获取查询结果
                let findResult = db.collection(collectionName).find(json);
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

}

//暴露出 Db的实例
module.exports = Db.getInstance();