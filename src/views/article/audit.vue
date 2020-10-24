<template>
    <el-dialog
        :title="title" :visible.sync="dialogVisible" width="50%"
        :before-close="handleClose"> 
        <el-form ref="formData" :model="formData" label-width="100px" label-position="right">
            <el-form-item label="标题:">
                <el-input v-model="formData.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="标签:" >
                <el-cascader
                    disabled
                    style="display:block"
                    v-model="formData.labelIds"
                    :options="labelOptions"
                    :props="{ multiple: true , emitPath:false,children:'labelList',value:'id',label:'name'}"
                    clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="主图:">
                <img :src="formData.imageUrl" style="width:178px;height:178px;display:block">
            </el-form-item>
            <el-form-item label="是否公开:">
                <el-radio-group v-model="formData.ispublic" disabled>
                <el-radio :label="1">公开</el-radio>
                <el-radio :label="0">不公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="简介:">
                <el-input type="textarea" v-model="formData.summary" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容:">
                <mavonEditor v-model="formData.mdContent"/>
            </el-form-item>
            <el-form-item align="center" v-if="isAudit">
                <el-button type="primary" @click="auditSuccess()">审核通过</el-button>
                <el-button type="danger" @click="auditFail()">审核不通过</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import ApiArticel from '@/api/article'
import ApiCategory from '@/api/category'

//引入mavonEditor 组件和样式
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components:{mavonEditor },
    props:{
        id:null, //文章ID
        isAudit:{  //是否为审核页面
            type:Boolean,
            default:false
        },   
        title:{
            type:String,
            default:''
        },
        dialogVisible:{
            type:Boolean,
            default:false
        },
        remoteClose:Function  //用于关闭窗口
    },
    data(){
        return{
            formData:{

            },
            labelOptions:[]
        }
    },
    watch:{
        dialogVisible(val){   //监听dialogVisible的变化，将改变后的值作为参数传入
            if(val){
                this.getLabelOptions();
                //val为true ，则打开窗口，
                this.getArticleById();
            }
        }
    },
    methods:{
        handleClose(){
            this.remoteClose();
        },
        async auditSuccess(){
            this.$confirm('确认审核通过吗?','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                ApiArticel.auditSuccess(this.id).then(response=>{
                    this.$message({
                        type:'success',
                        message:'审核通过'
                    });
                    this.remoteClose();
                })
                
            }).catch(()=>{

            })
        },
        auditFail(){
            this.$confirm('确认审核不通过吗?','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                ApiArticel.auditFail(this.id).then(response=>{
                    this.$message({
                        type:'success',
                        message:'操作成功'
                    });
                    this.remoteClose();
                })
                
            }).catch(()=>{

            })
        },
        async getArticleById(){
            const {data} = await ApiArticel.GetListByID(this.id);
            this.formData=data;
        },
        async getLabelOptions(){
            const {data}=await ApiCategory.getCategoryAndLabel();
            this.labelOptions=data;
        }
    }
}
</script>