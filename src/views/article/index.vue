<template>
    <div class="app-container">
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="文章标题:">
                <el-input v-model.trim="query.title"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" clearable filterable>
                    <el-option label="未审核" :value="1"></el-option>
                    <el-option label="审核通过" :value="2"></el-option>
                    <el-option label="审核未通过" :value="3"></el-option>
                    <el-option label="已删除" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格组件 -->
        <el-table :data="list" border stripe style="width: 100%" :row-style="{height: '40px'}" :cell-style="{padding: '0px'}" >
            <el-table-column type="index" label="序号" align="center" width="90" ></el-table-column>
            <el-table-column prop="id" label="ID" v-if="false" width="180"></el-table-column>
            <el-table-column prop="title" label="文章标题" align="center" width="180"></el-table-column>
            <el-table-column prop="viewCount" label="浏览量" align="center" width="180"></el-table-column>
            <el-table-column prop="thumhup" label="点赞量" align="center"></el-table-column>
            <el-table-column prop="ispublic" label="是否公开" align="center" width="180">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.ispublic===0" size="small" type="danger">不公开</el-tag>
                    <el-tag v-if="scope.row.ispublic===1" size="small" type="warning">公开</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="180">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status===0" size="small" type="danger">已删除</el-tag>
                    <el-tag v-if="scope.row.status===1" size="small">未审核</el-tag>
                    <el-tag v-if="scope.row.status===2" size="small" type="success">审核通过</el-tag>
                    <el-tag v-if="scope.row.status===3" size="small" type="warning">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="最后更新时间" align="center" >
                <template slot-scope="scope">
                    {{getFormat(scope.row.updateDate)}}
                </template>
            </el-table-column>
            <el-table-column  align="left" label="操作">
                <template slot-scope="scope">
                    <!-- 审核:只有status===1 才显示 ，其他不显示 -->
                    <el-button size="mini" type="primary" @click="openView(scope.row.id)">查看</el-button>
                    <el-button v-if="scope.row.status === 1" size="mini" type="success" @click="openAudit(scope.row.id)">审核</el-button>
                    <el-button v-if="scope.row.status !== 0" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
        <audit :title="audit.title" :dialogVisible="audit.dialogVisible" :remoteClose="remoteClose" :id="audit.id" :isAudit="audit.isAudit"/>
    </div>
</template>

<script>

import ApiArticel from '@/api/article'
import {format} from '@/utils/date'
import Audit from './audit'
export default {
    name:'Article',
    components:{Audit},
    data(){
        return{
            list:[],
            page:{
                current:1,
                size:20,
                total:0
            },
            query:{},
            audit:{
                title:'',
                dialogVisible:false,
                id:'',
                isAudit:true,
            }
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        async fetchData(){
            const {data}=await ApiArticel.getList(this.query,this.page.current,this.page.size);
            this.list=data.records;
            this.page.total=data.total;
        },
        ///格式化日期
        getFormat(data){
            return format(data);
        },
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
        //审核文章
        openAudit(id){
            this.audit.title="审核文章";
            this.audit.dialogVisible=true;
            this.audit.id=id;
            this.audit.isAudit=true;
        },
        //关闭审核窗口
        remoteClose(){
            this.audit.dialogVisible=false;
            this.audit.isAudit=false;
            this.fetchData();
        },
        //查看详情
        openView(id){
            this.audit.title="文章详情";
            this.audit.dialogVisible=true;
            this.audit.id=id;
            this.audit.isAudit=false;
            console.log('id',this.audit.id,'isAudit',this.audit.isAudit)
        },
        //删除
        handleDelete(id){
            this.$confirm('确认要删除这条信息吗?','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                ApiArticel.deleteById(id).then(response=>{
                    if(response.code===20000){
                        this.$message({
                            message:'删除成功',
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
        }
    }
}
</script>
