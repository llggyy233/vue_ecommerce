<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置商品参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!--级联选择器-->
      <el-row class="cate_options">
        <el-col>
          <span>选择商品的分类：</span>
          <el-cascader
            v-model="selectedCate"
            :options="cateList"
            :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--Tab 标签-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="用户管理" name="many">
          <el-button type="primary" :disabled="isDisableed" @click="addDialogVisible = true">添加用户</el-button>
          <!--动态参数表格-->
          <el-table
            :data="activeData"
            style="width: 100%"
            stripe>
            <el-table-column
              type="expand"
              width="180">
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="180">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button type="primary" :disabled="isDisableed" @click="addDialogVisible = true">添加配置</el-button>
          <!--静态属性表格-->
          <el-table
            :data="staticData"
            style="width: 100%"
            stripe>
            <el-table-column
              type="expand"
              width="180">
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="180">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框-->
    <el-dialog
      :title="'添加' + attrTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddForm">
      <el-form :model="addAttrForm" :rules="addAttrFormrules" ref="addAttrFormRef" label-width="100px">
        <el-form-item :label="attrTitle" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数对话框-->
      <el-dialog
      :title="'编辑' + attrTitle"
      :visible.sync="editDialogVisiable"
      width="50%"
      @close="resetEditForm">
        <el-form :model="editAttrForm" :rules="editAttrFormrules" ref="editAttrFormRef" label-width="100px">
          <el-form-item :label="attrTitle" prop="attr_name">
            <el-input v-model="editAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editAttr">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器双向绑定的数组
      selectedCate: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 激活的Tab标签
      activeName: 'many',
      // 动态参数数据
      activeData: [],
      // 静态参数数据
      staticData: [],
      // 控制添加属性对话框的显示与隐藏
      addDialogVisible: false,
      // 添加属性表单数据
      addAttrForm: {},
      // 添加属性表单校验规则
      addAttrFormrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制编辑属性对话框的显示与隐藏
      editDialogVisiable: false,
      // 编辑属性表单
      editAttrForm: {},
      // 编辑属性表单验证规则
      editAttrFormrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取商品分类列表
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      console.log(res.data)
      this.cateList = res.data
    },
    // 级联选择器选定项发生改变是触发
    handleChange() {
      this.getParamsInfo()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsInfo()
    },
    // 获取配置信息
    async getParamsInfo() {
      // 判断选中项是否为三级分类
      if (this.selectedCate.length !== 3) {
        // 不为三级分类则将该数组清空
        this.selectedCate = []
        return
      }
      const { data: res } = await this.$axios.get(`categories/${this.cateID}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('请求数据错误')
      }
      if (this.activeName === 'many') {
        this.activeData = res.data
      } else if (this.activeName === 'only') {
        this.staticData = res.data
      }
    },
    resetAddForm() {
      this.$refs.addAttrFormRef.resetFields()
    },
    // 发送请求，添加属性
    addAttr() {
      this.$refs.addAttrFormRef.validate(async valid => {
        if (valid !== true) {
          this.$message.error('添加属性失败')
        }
        const { data: res } = await this.$axios.post(`categories/${this.cateID}/attributes`, { attr_name: this.addAttrForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsInfo()
      })
    },
    // 点击编辑显示编辑对话框
    async showEditDialog(attr) {
      const { data: res } = await this.$axios.get(`categories/${this.cateID}/attributes/${attr.attr_id}`, { params: { id: this.cateID, attrId: attr.attr_id, attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户信息失败')
      }
      this.editAttrForm = res.data
      this.editDialogVisiable = true
    },
    // 关闭编辑对话框清空编辑表单
    resetEditForm() {
      this.$refs.editAttrFormRef.resetFields()
    },
    // 发送请求，编辑属性
    editAttr() {
      this.$refs.editAttrFormRef.validate(async valid => {
        if (valid !== true) {
          return this.$message.error('修改属性信息失败')
        }
        const { data: res } = await this.$axios.put(`categories/${this.cateID}/attributes/${this.editAttrForm.attr_id}`, { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改属性信息失败')
        }
        this.$message.success('修改属性信息成功')
        this.getParamsInfo()
        this.editDialogVisiable = false
      })
    }
  },
  computed: {
    // 控制添加按钮是否禁用
    isDisableed() {
      if (this.selectedCate.length === 3) {
        return false
      } else {
        return true
      }
    },
    // 获取分类的ID
    cateID() {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2]
      }
      return null
    },
    // 对话框Title
    attrTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cate_options {
  margin: 20px 0;
  font-size: 16px;
}
</style>
