<template>
    <el-dialog
        :title="title" :visible.sync="dialogVisible" width="500px"
        :before-close="handleClose"> 
        <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" label-position="right" style="width:400px" status-icon>
            <el-form-item label="分类名称:" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="formData.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
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
        <!-- <div slot="footer" class="dialog-footer" style="margin-right:13%">
            <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
        </div> -->
    </el-dialog>
</template>
<script>
import ApiCategory from '@/api/category'
export default {
    data(){
        return{
            rules:{
                name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ],
                status:[
                    {required:true,message:'请选择状态',trigger:'change'}
                ],
                sort:[
                    {required:true,message:'请输入排序',trigger:'blur'}
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
        remoteClose:Function   //用于关闭对话框
    },
    methods:{
        //关闭窗口
        handleClose(){
            this.$refs['formData'].resetFields();
            this.remoteClose();
        },
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
            let response =null;
            if(this.formData.id){
                response= await ApiCategory.update(this.formData);
            }
            else{
                response= await ApiCategory.add(this.formData);
            }
            if(response.code===20000){
                this.$message({
                    type:'success',
                    message:response.message
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