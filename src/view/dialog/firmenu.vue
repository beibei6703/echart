<template>
  <div>
    <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="一级菜单" width="45%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="120px"
        ref="ruleForm"
      >
        <div class="items">
          <el-form-item label="系统名称" prop="systemId">
            <el-select filterable placeholder="请选择" v-model="ruleForm.systemId">
              <el-option
                :key="itemSys.id"
                :label="itemSys.name"
                :value="itemSys.id"
                v-for="itemSys in systemList"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="items">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
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
import { getSystemList } from '@src/api/system/index.js';
import { validateUrl } from '@src/utils/validateRules.js';
export default {
    name: 'firmenu',
    props: ['isFirmenuDialog', 'menuItem'],
    data() {
        return {
            dialogVisible: true,
            systemList: [],
            input: '',
            ruleForm: {
                systemId: '',
                name: '',
                address: ''
            },
            rules: {
                systemId: [{ required: true, message: '请选择系统名称', trigger: 'change' }],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
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
    created() {
        this.getSystems();
        if (this.menuItem) {
            this.ruleForm.systemId = this.menuItem.systemId;
            this.ruleForm.name = this.menuItem.name;
            this.ruleForm.address = this.menuItem.address;
            this.ruleForm.id = this.menuItem.id;
            this.ruleForm.level = this.menuItem.level;
        }
    },
    methods: {
        // 获取系统列表
        getSystems() {
            getSystemList({}).then(res => {
                const data = res.data;
                if (data.success && data.data.list) {
                    data.data.list.forEach(item => {
                        this.systemList.push({
                            id: item.id,
                            name: item.name
                        });
                    });
                }
            });
        },
        handleClose(done) {
            this.$emit('getDialog');
            this.dialogVisible = this.isFirmenuDialog;
            // if(this.isFirmenuDialog){
            //     this.dialogVisible = true
            // }else{
            //     this.dialogVisible = false
            // }
            done();
        },
        cancle() {
            this.$emit('getDialog');
            this.dialogVisible = this.isFirmenuDialog;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.ruleForm.parentId = 0;
                    if (this.ruleForm.id) {
                        getMenuUpdate(this.ruleForm).then(res => {
                            const data = res.data;
                            if (data.success) {
                                this.$emit('getDialog');
                                this.successMsg(data.message);
                                this.$store.dispatch('getsystems');
                            } else {
                                this.errorMsg(data.message);
                            }
                        });
                    } else {
                        this.ruleForm.level = 1;
                        getMenuAdd(this.ruleForm).then(res => {
                            const data = res.data;
                            if (data.success) {
                                this.$emit('getDialog');
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
.btns >>>.el-button {
    padding: 8px 15px;
    float: right;
    margin-right: 20px;
}
</style>
