import request from '@/utils/request'

export default{
    getList(data){
        return request({
            url:'/system/menu/search',
            method:'post',
            data
        })
    },
    addMenu(data){
        return request({
            url:`/system/menu`,
            method:'post',
            data
        })
    },
    getMenuById(id){
        return request({
            url:`/system/menu/${id}`,
            method:'get'
        })
    },
    updateMenu(data){
        return request({
            url:'/system/menu',
            method:'put',
            data
        })
    },
    deleteById(id){
        return request({
            url:`system/menu/${id}`,
            method:'delete'
        })
    }
}
