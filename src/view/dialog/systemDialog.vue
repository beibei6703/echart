<template>
  <div>
    <el-dialog
      :before-close="handleCloseDia"
      :visible.sync="dialogVisible"
      title="新增系统"
      width="45%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="120px"
        ref="ruleForm"
      >
        <div class="items">
          <el-form-item label="系统名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </div>
        <div class="items">
          <el-form-item class="item_form" label="系统管理员">
            <el-tag
              :disable-transitions="false"
              :key="items.workCode"
              @close="handleClose(items)"
              closable
              v-for="items in ruleForm.administrator"
            >{{items.name}}</el-tag>
            <div class="positionItem">
              <el-input
                @blur="handleInputConfirm"
                @input="getAdmin"
                class="input-new-tag specinput"
                ref="saveTagInput"
                size="small"
                v-if="inputVisible"
                v-model="adminName"
              ></el-input>
              <el-button @click="showInput" class="button-new-tag" size="small" v-else>+ 管理员</el-button>

              <div class="listAdmin" v-if="isShow">
                <ul>
                  <li
                    :key="itemAdmin.workCode"
                    @click="getAdminName(itemAdmin)"
                    v-for="itemAdmin in administratorList"
                  >{{itemAdmin.name}}</li>
                </ul>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="items">
          <el-form-item label="系统描述">
            <el-input
              :rows="3"
              placeholder="请输入描述信息"
              type="textarea"
              v-model="ruleForm.description"
            ></el-input>
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
import { getAddSystem, getAdministrator } from '@src/api/system/index.js';
export default {
    name: 'systemDialog',
    props: ['isSystemDialog'],
    data() {
        return {
            dialogVisible: true,
            isShow: false,
            inputVisible: false,
            isFlag: false,
            adminName: '',
            ruleForm: {
                name: '',
                administrator: [],
                description: ''
            },
            administratorList: [],
            rules: {
                name: [
                    { required: true, message: '请输入系统名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
                ]
            },
            value: ''
        };
    },
    mounted() {
        document.addEventListener('click', e => {
            if (e.target.className !== 'specinput') {
                this.isShow = false;
                this.adminName = '';
            }
        });
    },
    methods: {
        handleClose(item) {
            for (var i = 0; i < this.ruleForm.administrator.length; i++) {
                if (this.ruleForm.administrator[i].workCode === item.workCode) {
                    this.ruleForm.administrator.splice(i, 1);
                    break;
                }
            }
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.adminName;
            if (inputValue) {
                console.log(inputValue);
            }
            this.inputVisible = false;
            this.adminName = '';
        },
        handleCloseDia(done) {
            this.$emit('getDialig');
            this.dialogVisible = this.isSystemDialog;
            done();
        },
        cancle() {
            this.$emit('getDialig');
            this.dialogVisible = this.isSystemDialog;
        },
        getAdmin(val) {
            this.administratorList = [];
            if (val.length > 0) {
                const parms = {
                    name: val
                };
                getAdministrator(parms).then(res => {
                    const data = res.data;
                    if (data.success && data.data.length > 0) {
                        this.isShow = true;
                        this.administratorList = data.data;
                    } else {
                        this.administratorList = [];
                    }
                });
            } else {
                this.administratorList = [];
            }
        },
        // 点击li
        getAdminName(item) {
            this.isFlag = true;
            this.adminName = '';
            this.isShow = false;
            var flag = true;
            if (this.ruleForm.administrator.length > 0) {
                for (var i = 0; i < this.ruleForm.administrator.length; i++) {
                    if (this.ruleForm.administrator[i].workCode === item.workCode) {
                        flag = false;
                        this.errorMsg('重复选择');
                        break;
                    }
                }
                if (flag) {
                    this.ruleForm.administrator.push(item);
                }
            } else {
                this.ruleForm.administrator.push(item);
            }
        },
        deletAdmin(item) {
            for (var i = 0; i < this.ruleForm.administrator.length; i++) {
                if (this.ruleForm.administrator[i].workCode === item.workCode) {
                    this.ruleForm.administrator.splice(i, 1);
                    break;
                }
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const parms = {
                        name: this.ruleForm.name,
                        administrator: JSON.stringify(this.ruleForm.administrator),
                        description: this.ruleForm.description
                        // address
                    };
                    getAddSystem(parms).then(res => {
                        const data = res.data;
                        if (data.success) {
                            this.$emit('getDialig');
                            this.successMsg(data.message);
                            this.$store.dispatch('getsystems');
                        } else {
                            this.errorMsg(data.message);
                        }
                    });
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
    height: 40px;
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-start;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
}
.demo-ruleForm {
    background: #fff;
    padding-bottom: 50px;
}
.items >>> .el-form-item__content {
    display: flex;
    justify-content: center;
    align-items: center;
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
    height: 40px;
}
.items >>> .el-input__icon {
    line-height: 40px;
}
.items >>> .el-input__inner {
    width: 260px;
    height: 40px;
}
.items >>> .el-textarea__inner {
    width: 260px;
}
.btns {
    width: 100%;
    padding-top: 38px;
}
.btns >>> .el-button {
    padding: 8px 15px;
    float: right;
    margin-right: 20px;
}
.positionItem {
    position: relative;
}
.positionItem >>> .el-input {
    width: 120px;
}
.positionItem >>> .el-input__inner {
    width: 120px;
}
.nameList {
    position: absolute;
    top: 0px;
    /* left:120px; */
    z-index: 99;
}
.nameList > span {
    /* display:inline-block; */
    border: 1px solid #ddd;
    padding: 3px 12px 3px 5px;
    margin-left: 5px;
    position: relative;
}
.el-icon-close {
    position: absolute;
    font-size: 12px;
    top: 0px;
    cursor: pointer;
}
.listAdmin {
    position: absolute;
    z-index: 999;
    width: 200px;
    min-height: 50px;
    max-height: 120px;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    top: 40px;
    left: 0px;
    z-index: 99;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
}
.listAdmin li {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
}
.listAdmin li:hover {
    background: #f5f6f8 !important;
    color: #3a404c !important;
}
</style>
