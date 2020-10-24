<template >
    <div class="app-container">
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="菜单名称:">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd(0)">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table row-key="id" :data="list" border stripe  style="width: 100%">
            <el-table-column prop="id" label="ID" v-if="false"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="url" label="请求地址" align="center"></el-table-column>
            <el-table-column prop="code" label="权限标识" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center" >
                <template slot-scope="scope">
                    <span v-if="scope.row.type===1">目录</span>
                    <span v-if="scope.row.type===2">菜单</span>
                    <span v-if="scope.row.type===3">按钮</span>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标" align="center">
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center">
                
            </el-table-column>
            <el-table-column  align="center" label="操作">
                <template slot-scope="scope">
                    <!-- 审核:只有status===1 才显示 ，其他不显示 -->
                    <el-button size="mini" type="primary" @click="handleAdd(scope.row.id)">新增</el-button>
                    <el-button size="mini" type="warning" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit :title="edit.title" :dialogVisible="edit.dialogVisible" :formData="edit.formData" :remoteClose="remoteClose"/>
    </div>
</template>
<script>
import ApiMenu from '@/api/menu'
import Edit from './edit'
export default {
    name:'Menu',
    components:{Edit},
    data(){
        return{
            list:[],
            query:{

            },
            edit:{
                title:'',
                dialogVisible:false,
                formData:{
                    parentId:0
                }
            }
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        async fetchData(){
            const {data}= await ApiMenu.getList(this.query);
            this.list=data;
        },
        //新增菜单，id作为新菜单的parentId
        handleAdd(id){
            this.edit.formData.parentId=id;
            this.edit.dialogVisible=true;
            this.edit.title="新增";
        },
        handleEdit(id){
            ApiMenu.getMenuById(id).then(response=>{
                if(response.code===20000){
                    this.edit.formData=response.data;
                    this.edit.title="修改";
                    this.edit.dialogVisible=true;
                }
            })
        },
        handleDelete(id){
            this.$confirm('确认删除当前菜单及它的子菜单吗?','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                ApiMenu.deleteById(id).then(response=>{
                    if(response.code=20000){
                        this.$message({
                            message:response.message,
                            type:'success'
                        });
                        this.fetchData();
                    }
                    else{
                        this.$message({
                            message:response.message,
                            type:'error'
                        })
                    }
                })
            })
        },
        openAdd(id){
            this.edit.dialogVisible=true;
            this.edit.title="新增";
        },
        reload(){
            this.query={};
            this.fetchData();
        },
        //关闭弹窗
        remoteClose(){
            this.edit.dialogVisible=false;
            this.fetchData();
        }
    }
}
</script>