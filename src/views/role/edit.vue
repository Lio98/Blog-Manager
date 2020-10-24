<template>
    <el-dialog
        :title="title" :visible.sync="dialogVisible" width="500px"
        :before-close="handleClose"> 
        <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" label-position="right" style="width:400px" status-icon>
            <el-form-item label="角色名称:" prop="name">
                <el-input v-model="formData.name"></el-input>
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
export default {
    data(){
        return{
            rules:{
                name:[
                    {required:true,message:'请输入角色名称',trigger:'blur'}
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

        },
        handleClose(){
            this.remoteClose();
        }
    }
}
</script>