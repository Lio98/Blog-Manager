import request from '@/utils/request'

export default({
    getList(query,current=1,size=20){
        return request({
            url:'/article/label/search',
            method:'post',
            data:{
                ...query,
                current,
                size
            }
        })
    },
    add(data){
        return request({
            url:'/article/label',
            method:'post',
            data
        })
    },
    getListById(id){
        return request({
            url:`/article/label/${id}`,
            method:'get',
        })
    },
    update(data){
        return request({
            url:'/article/label',
            method:'put',
            data
        })
    },
    deleteById(id){
        return request({
            url:`/article/label/${id}`,
            method:'delete'
        })
    }
})