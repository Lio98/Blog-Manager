<template>
    <el-dialog
        :title="title" :visible.sync="dialogVisible" width="400px"
        :before-close="handleClose"> 
        <el-form ref="formData" :rules="rules" :model="formData"  label-width="100px" label-position="right" style="width:300px" status-icon>
            <el-form-item label="标签名称:" prop="name">
                <el-input v-model="formData.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="分类名称:" prop="categoryId">
                <el-select v-model="formData.categoryId" clearable filterable >
                    <el-option 
                        v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                <el-button size="mini" @click="handleClose">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

import ApiLabel from '@/api/label'

export default {
    data(){
        return{
            rules:{
                name:[
                    {required:true,message:'请输入标签名称',trigger:'blur'}
                ],
                categoryId:[
                    {required:true,message:'请输入分类名称',trigger:'change'}
                ]
            }
        }
    },
    props:{
        title:{
            type:String,
            default:''
        },
        dialogVisible:{
            type:Boolean,
            default:false
        },
        formData:{
            type:Object,
            default:{}
        },
        categoryList:{
            type:Array,
            default:[]
        },
        remoteClose:Function   //用于关闭对话框
    },
    methods:{
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.submitData();
                }
                else{
                    console.log('error submit');
                    return false;
                }
            })
        },
        handleClose(){
            //将表单清空
            this.$refs['formData'].resetFields();
            this.remoteClose()
        },
        async submitData(){
            let response=null;
            if(this.formData.id){
                response=await ApiLabel.update(this.update);
            }
            else{
                response=await ApiLabel.add(this.formData);
            }
            if(response.code===20000){
                this.$message({
                    message:response.message,
                    type:'success'
                });
                this.handleClose();
            }
            else{
                this.$message({
                    message:response.message,
                    type:'error'
                })
            }
        }
    }
}
</script>