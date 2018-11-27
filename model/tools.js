/**Created by xiaoqi on 2018/11/26*/

let md5 = require('md5');

let tools = {
    //md5加密
    md5(str){
        return md5(str);
    },
    //格式化数据
    cateToList(data){
        //1获取一级分类
        let firstArr = [];

        for(let i=0;i<data.length;i++){
            if(data[i].pid == "0"){
                firstArr.push(data[i])
            }
        }

        //2获取二级分类
        for(let j=0;j<firstArr.length;j++){
            //为每一个一级分类添加数组
            firstArr[j].list = [];
            for(let k=0;k<data.length;k++){
                if(firstArr[j]._id == data[k].pid ){
                    firstArr[j].list.push(data[k]);
                }
            }
        }
        return firstArr;
    }

};
module.exports=tools ;