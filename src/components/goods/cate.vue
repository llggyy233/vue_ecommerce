<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <tree-table
      :data="cateList"
      :columns='columns'
      border
      :selection-type='false'
      :expand-type='false'
      show-index
      index-text='#'
      class="treetable"
      :show-row-hover="false"
      >
        <!-- 有效-->
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--排序-->
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning"  v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="edit">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </tree-table>
      <!--分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="resetAddForm"
      >
      <el-form :model="addCateForm" :rules="addCaterules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--级联选择器-->
          <!--options 绑定要显示的数据对象-->
          <!--props 用来指定要配置的对象-->
          <el-cascader
            v-model="choosedCate"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="handleChange"
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表信息获取参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 商品分类信息
      cateList: [],
      // treetable的列数据绑定
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'edit'
        }
      ],
      // 控制添加分类对话框显示与隐藏
      addCatedialogVisible: false,
      // 添加分类表单
      addCateForm: {
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 默认添加一级分类
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCaterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类表单
      ParentCateList: [],
      // 级联选择器要配置的对象
      cascaderProps: {
        // 选中的属性的值
        value: 'cat_id',
        // 选中的属性要显示的标签
        label: 'cat_name',
        // 选中属性的子属性
        children: 'children',
        // 指定级联选择器展开方法
        expandTrigger: 'hover'
      },
      // 选定属性的ID值（父级ID和子级ID）
      choosedCate: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类信息
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败')
      }
      // console.log(res.data)
      this.total = res.data.total
      this.cateList = res.data.result
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      // 先获取父级分类列表
      this.getParentCateList()
      // 在显示对话框
      this.addCatedialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.ParentCateList = res.data
      console.log(this.ParentCateList)
    },
    // 级联选择器选中后触发
    handleChange() {
      if (this.choosedCate.length !== 0) {
        this.addCateForm.cat_pid = this.choosedCate[this.choosedCate.length - 1]
        this.addCateForm.cat_level = this.choosedCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定增加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid !== true) {
          return
        }
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
      })
      this.addCatedialogVisible = false
    },
    // 关闭对话框重置表单
    resetAddForm() {
      this.$refs.addCateFormRef.resetFields()
      this.choosedCate = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin: 10px 0;
}

.el-cascader {
  width: 100%;
}
</style>
