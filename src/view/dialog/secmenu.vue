<template>
  <div>
    <el-dialog :before-close="handleClose" :visible.sync="dialogVisibleSec" title="二级菜单" width="45%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="120px"
        ref="ruleForm"
      >
        <div class="items">
          <el-form-item label="二级菜单名称" prop="name">
            <el-input  v-model="ruleForm.name"></el-input>
          </el-form-item>
        </div>
        <div class="items">
          <el-form-item label="上一级菜单" prop="parentName">
            <el-input :disabled="true" v-model="ruleForm.parentName"></el-input>
          </el-form-item>
        </div>
        <div class="items">
          <el-form-item label="访问地址" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
        </div>
        <div class="btns">
          <el-form-item>
            <el-button @click="cancle">取 消</el-button>
            <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuAdd, getMenuUpdate } from '@src/api/menu/index.js';
import { validateUrl } from '@src/utils/validateRules.js';
export default {
    name: 'secmenu',
    props: ['isSecMenuDialog', 'menuItem'],
    data() {
        return {
            dialogVisibleSec: true,
            systemList: [],
            input: '',
            ruleForm: {
                parentName: '',
                name: '',
                address: ''
            },
            // type:localStorage.getItem('type'),
            rules: {
                parentName: [{ required: true, message: '请输入上一级菜单', trigger: 'blur' }],
                name: [
                    { required: true, message: '请输入二级菜单名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度不能高于10字符个字符', trigger: 'blur' }
                ],
                address: [
                    { required: true,
                        validator: validateUrl,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        getType() {
            return this.$store.state.process.type ? this.$store.state.process.type : null;
        }
    },
    created() {
        if (this.menuItem) {
            this.ruleForm.systemId = this.menuItem.systemId;
        }
    },
    mounted() {
        // 如果是新增二级菜单
        if (this.getType && this.getType === 'add' && this.menuItem) {
            this.ruleForm.systemId = this.menuItem.systemId;
            this.ruleForm.parentId = this.menuItem.id;
            this.ruleForm.parentName = this.menuItem.name;
            this.ruleForm.address = '';
        }
        if (this.getType && this.getType === 'edit' && this.menuItem) {
            this.ruleForm.name = this.menuItem.name;
            this.ruleForm.parentName = this.menuItem.parentName;
            this.address = this.menuItem.address;
            this.ruleForm.level = this.menuItem.level;
            this.ruleForm.id = this.menuItem.id;
            this.ruleForm.address = this.menuItem.address;
            this.ruleForm.parentId = this.menuItem.parentId;
        }
    },
    methods: {
        handleClose(done) {
            this.$emit('getDialogSec');
            this.dialogVisibleSec = this.isSecMenuDialog;

            done();
        },
        cancle() {
            this.$emit('getDialogSec');
            this.dialogVisibleSec = this.isSecMenuDialog;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.ruleForm.id) {
                        // this.ruleForm.name = this.menuItem.name
                        getMenuUpdate(this.ruleForm).then(res => {
                            const data = res.data;
                            if (data.success) {
                                this.$emit('getDialogSec');
                                this.successMsg(data.message);
                                this.$store.dispatch('getsystems');
                            } else {
                                this.errorMsg(data.message);
                            }
                        });
                    } else {
                        this.ruleForm.level = 2;
                        getMenuAdd(this.ruleForm).then(res => {
                            const data = res.data;
                            if (data.success) {
                                this.$emit('getDialogSec');
                                this.successMsg(data.message);
                                this.$store.dispatch('getsystems');
                            } else {
                                this.errorMsg(data.message);
                            }
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.items {
    width: 100%;
    height: 30px;
    margin-bottom: 25px;
}
.items > span {
    margin: 0 15px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
}
.items >>> .el-input {
    width: 260px;
    height: 30px;
}
.items >>> .el-input__icon {
    line-height: 30px;
}
.items >>> .el-input__inner {
    width: 260px;
    height: 30px;
}
.btns {
    width: 100%;
    padding: 38px 0;
}
.btns >>> .el-button {
    padding: 8px 15px;
    float: right;
    margin-right: 20px;
}
</style>
