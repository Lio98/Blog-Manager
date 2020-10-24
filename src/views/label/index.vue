<template>
    <div class="app-container">
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="标签名称:">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item label="分类名称:">
                <el-select v-model="query.categoryId" clearable filterable >
                    <el-option 
                        v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
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
            <el-table-column prop="name" label="标签名称" align="center" ></el-table-column>
            <el-table-column prop="categoryName" label="分类名称" align="center" ></el-table-column>
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
        <edit :title="edit.title" :dialogVisible="edit.dialogVisible" :categoryList="categoryList" :formData="edit.formData" :remoteClose="remoteClose"/>
    </div>
    
</template>

<script>
import ApiLabel from '@/api/label'
import ApiCategory from '@/api/category'
import Edit from './edit'

export default {
    name:'Label',
    components:{Edit},
    data(){
        return{
            list:[],
            page:{
                current:1,
                size:20,
                total:0
            },
            query:{},
            categoryList:[],   //正常状态的分类数据
            edit:{  //子组件引用属性对象
                title:'',
                dialogVisible:false,
                formData:{}
            }
        }
    },
    created(){
        this.fetchData()
        this.getCategoryList()
    },
    methods:{
        fetchData(){
            ApiLabel.getList(this.query,this.page.current,this.page.size).then(response=>{
                this.list=response.data.records;
                this.page.total=response.data.total;
            })
        },
        getCategoryList(){
            ApiCategory.getNormalList().then(response=>{
                this.categoryList=response.data;
            })
        },
        queryData(){
            this.page.current=1;
            this.fetchData();
        },
        //重置
        reload(){
            this.query={};
            this.fetchData();
        },
        //新增
        openAdd(){
            this.getCategoryList();
            this.edit.title="新增";
            this.edit.dialogVisible=true;
            this.edit.formData={};
        },
        remoteClose(){
            this.edit.formData={};
            this.edit.dialogVisible=false;
            this.fetchData();
        },
        handleEdit(id){
            ApiLabel.getListById(id).then(response=>{
                console.log(response);
                if(response.code===20000){
                    this.edit.dialogVisible=true;
                    this.edit.formData=response.data;
                    this.edit.title="修改";
                }
                else{
                    this.$message({
                        message:response.message,
                        type:'error'
                    })
                }
            })
        },
        handleDelete(id){
            this.$confirm('确认要删除这条记录吗?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                ApiLabel.deleteById(id).then(response=>{
                    console.log(response);
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
        handleSizeChange(val){
            this.page.size=val;
            this.fetchData();
        },
        handleCurrentChange(val){
            this.page.current=val;
            this.fetchData();
        }
    }
}
</script>