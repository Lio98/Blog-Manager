<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="角色名称:">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table row-key="id" :data="dataList" border stripe  style="width: 100%">
            <el-table-column type="index" width="120px" label="序号" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" v-if="false"></el-table-column>
            <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column  align="center" label="操作">
                <template slot-scope="scope">
                    <!-- 审核:只有status===1 才显示 ，其他不显示 -->
                    <el-button size="mini" type="primary" @click="handlePermission(scope.row.id)">分配权限</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="page.currentPage" 
            :page-sizes="[20, 50, 100, 200]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total" style="margin-top:10px">
        </el-pagination>
        <edit :title="edit.title" :dialogVisible="edit.dialogVisible" :formData="edit.formData" :remoteClose="remoteClose" />
    </div>
</template>

<script>
import ApiRole from '@/api/role'
import Edit from './edit'
export default {
    name:'Role',
    components:{Edit},
    data(){
        return{
            dataList:[],
            query:{},
            page:{
                currentPage:1,
                pageSize:20,
                total:0
            },
            edit:{
                title:'',
                dialogVisible:false,
                formData:{

                }
            }
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        fetchData(){
            ApiRole.getList(this.query,this.page.currentPage,this.page.pageSize).then(response=>{
                if(response.code===20000){
                    this.page.total=response.data.total;
                    this.dataList=response.data.records;
                }
            })
        },
        //重置
        reload(){
            this.query={};
            this.fetchData();
        },
        //新增
        openAdd(){
            this.edit.title="新增";
            this.edit.dialogVisible=true;

        },
        handleSizeChange(xmn){
            console.log(xmn);
            this.page.pageSize=xmn;
            this.fetchData();
        },
        handleCurrentChange(mn){
            console.log(mn);
            this.page.currentPage=mn;
            this.fetchData();
        },
        //分配权限
        handlePermission(id){

        },
        //编辑
        handleEdit(id){

        },
        //删除
        handleDelete(id){

        },
        remoteClose(){
            this.edit.formData={},
            this.edit.dialogVisible=false;
            this.fetchData();
        }
    }
}
</script>