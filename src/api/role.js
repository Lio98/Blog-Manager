import request from '@/utils/request'

export default{
    getList(query,currentPage=1,pageSize=1){
        return request({
            url:'/system/role/search',
            method:'post',
            data:{
                ...query,
                currentPage,
                pageSize
            }
        })
    }
}