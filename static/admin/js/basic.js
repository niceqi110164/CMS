/**Created by xiaoqi on 2018/11/26*/
$(function(){
    app.delete();
});

let app = {
    /**定义toggle方法*/
    toggle(el, collectionName, attr, id){
        /**ajax请求*/
        $.get(
            "/admin/changeStatus",
            { collectionName: collectionName, attr: attr ,id: id },
            function(data){
                if(data.success){
                    if(el.src.indexOf("yes")!=-1){
                        el.src = "/admin/images/no.gif"
                    }else{
                        el.src = "/admin/images/yes.gif"
                    }
                }
            }
        );
    },
    /**封装删除提示框*/
    delete(){
        $('.delete').click(()=>{
            let flag = confirm("确认要删除数据吗?");
            return flag;
        })
    }
};