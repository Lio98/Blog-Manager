<template>   
    <div class="app-container">
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="分类名称:">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" clearable filterable style="windth:85px">
                    <el-option 
                        v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格组件 -->
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="90" ></el-table-column>
            <el-table-column prop="id" label="ID" v-if="false" width="180"></el-table-column>
            <el-table-column prop="name" label="分类名称" align="center" width="180"></el-table-column>
            <el-table-column prop="sort" label="排序" align="center" width="180"></el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="180">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status|statusFilters">
                        {{scope.row.status?'正常':'禁用'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" align="center" label="创建时间"></el-table-column>
            <el-table-column  align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="page.current" 
            :page-sizes="[20, 50, 100, 200]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total" style="margin-top:10px">
        </el-pagination>
        <edit :title="edit.title" :dialogVisible="edit.dialogVisible" :formData="edit.formData" :remoteClose="remoteClose" />
    </div>
</template>
<script>
import ApiCategory from '@/api/category'
import Edit from './edit'

const statusOptions=[
    {code:1,name:'正常'},
    {code:0,name:'禁用'}
]
export default {
    name:'Category',
    components:{
        Edit
    },
    data(){
        return{
            list:[],
            query:{},
            page:{
                current : 1,
                size : 20,
                total : 0
            },
            statusOptions,   //状态下拉框数组
            edit:{
                title:'',
                dialogVisible:false,
                formData:{
                }
            }
        }
    },
    filters:{
        statusFilters(status){
            const statusMap={0:'danger',1:'success'}
            return statusMap[status]
        }
    },
    created(){
        this.fetchData()
    },
    methods:{
        handleSizeChange(val){
            this.page.size=val;
            this.fetchData();
        },
        handleCurrentChange(val){
            this.page.current=val;
            this.fetchData();
        },
        queryData(){
            this.page.current=1;
            this.fetchData();
        },
        reload(){
            this.query={};
            this.fetchData();
        },
        fetchData(){
            ApiCategory.getList(this.query,this.page.current,this.page.size).then(response=>{
                var resp=response.data;
                this.list=resp.records;
                this.page.total=resp.total;
            })
        },
        handleEdit(id){
            ApiCategory.getById(id).then(response=>{
                if(response.code===20000){
                    this.edit.formData=response.data;
                    this.edit.title="编辑";
                    this.edit.dialogVisible=true;
                }
            })
        },
        handleDelete(id){
            this.$confirm('确认要删除这条记录吗?', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                ApiCategory.deleteById(id).then(response=>{
                    if(response.code===20000){
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
            }).catch(()=>{
                
            })
        },
        //子组件会触发此事件方法来关闭窗口
        remoteClose(){
            this.edit.formData={};
            this.edit.dialogVisible=false;
            this.fetchData();
        },
        //打开新增窗口
        openAdd(){
            this.edit.dialogVisible=true;
            this.edit.title="新增";
        }
    }
}
</script>