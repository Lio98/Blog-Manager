<template>
    <el-dialog
        :title="title" :visible.sync="dialogVisible" width="500px"
        :before-close="handleClose"> 

        <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" label-position="right" style="width:400px" status-icon>
            <el-form-item label="类型:" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio :label="1">目录</el-radio>
                    <el-radio :label="2">菜单</el-radio>
                    <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限标识:" prop="code">
                <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="请求地址:" prop="url" v-if="formData.type!==3">
                <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="图标:" prop="icon" v-if="formData.type!==3">
                <el-input v-model="formData.icon"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="10" style="width:300px"></el-input-number>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                <el-button size="mini" @click="handleClose">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import ApiMenu from '@/api/menu'

export default {
    data(){
        return{
            rules:{
                name:[
                    {required:true,message:'请输入名称',trigger:'blur'}
                ],
                code:[
                    {required:true,message:'请输入权限标识',trigger:'blur'}
                ],
                type:[
                    {required:true,message:'请选择类型',trigger:'change'}
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
        remoteClose:Function
    },
    watch:{
        dialogVisible(val){
            // console.log(val)
        }
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
        async submitData(){ 
            let response=null;
            if(this.formData.type===3){
                this.formData.icon="";
                this.formData.url="";
            }
            if(this.formData.id){
                response= await ApiMenu.updateMenu(this.formData);
            }
            else{
                response= await ApiMenu.addMenu(this.formData);
            }
            
            if(response.code===20000){
                    this.$message({
                        message:response.message,
                        type:'success'
                    })
                    this.handleClose();
                }
            else{
                this.$message({
                    message:response.message,
                    type:'error'
                })
            }
        },
        //关闭窗口
        handleClose(){
            this.$refs['formData'].resetFields();
            this.remoteClose();
        }
    }
}
</script>