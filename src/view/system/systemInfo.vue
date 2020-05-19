<template>
  <div class="contentSys">
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
        <el-form-item class="item_form" label="系统管理员" prop="administrator">
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
      <div class="items1">
        <el-form-item label="系统描述">
          <el-input :rows="3" placeholder="请输入描述信息" type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
      </div>
      <div class="items">
        <el-form-item label="访问地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
      </div>
      <div class="items">
        <el-form-item label="创建日期">
          <el-input v-model="ruleForm.gmtCreated" disabled></el-input>
        </el-form-item>
      </div>
      <div class="btns">
        <el-form-item>
          <el-button @click="cancle">取 消</el-button>
          <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getAdministrator, getsystemUpdate } from '@src/api/system/index.js';
import { validateAddress } from '@src/utils/validateRules.js';
export default {
    name: 'systemInfo',
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
                description: '',
                address: '',
                gmtCreated: ''
            },
            administratorList: [],
            systemInfo: {},
            rules: {
                name: [
                    { required: true, message: '请输入系统名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
                ],
                address: [
                    {
                        validator: validateAddress,
                        trigger: 'blur'
                    }
                ],
                administrator: [
                    {required: true, message: '请添加管理员'}
                ]

            }
        };
    },
    created() {
        this.systemInfo = JSON.parse(this.$route.query.systemInfo);
        this.systemInfo.administrator = JSON.parse(this.systemInfo.administrator);
        this.ruleForm = Object.assign({}, this.systemInfo);
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
        // 添加管理员按钮
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
        cancle() {
            this.$router.push('/systemlist');
        },
        // 输入查找管理员
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

        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const parms = {
                        id: this.ruleForm.id,
                        name: this.ruleForm.name,
                        administrator: JSON.stringify(this.ruleForm.administrator),
                        description: this.ruleForm.description,
                        address: this.ruleForm.address,
                        isEnable: this.ruleForm.isEnable
                        // address
                    };
                    getsystemUpdate(parms).then(res => {
                        const data = res.data;
                        if (data.success) {
                            this.$router.push('/systemlist');
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
.contentSys {
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 10px;
    margin-top: 20px;
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
.items >>> .el-form-item {
    height: 40px;
}
.items >>> .el-form-item__content {
    display: flex;
    justify-content: center;
    align-items: center;
}
.items {
    width: 100%;
    height: 40px;
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-start;
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
.items1 >>> .el-textarea__inner {
    width: 260px;
}
.btns {
    width: 100%;
    padding-top: 38px;
}
.btns >>> .el-button {
    padding: 8px 15px;
    float: center;
    /* margin-right: 20px; */
}
.positionItem {
    position: relative;
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
    max-height: 150px;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    top: 40px;
    left: 10px;
    z-index: 99;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
}
.listAdmin li {
    height: 30px;
    line-height: 30px;
    text-indent: 10px;
    display: inline-block;
    width: 100%;
}
.listAdmin li:hover {
    background: #f5f6f8 !important;
    color: #3a404c !important;
}
</style>
