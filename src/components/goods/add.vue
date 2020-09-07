<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
        <!--提示信息-->
        <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false">
        </el-alert>
        <!--进度条-->
        <el-steps :space="200" :active="activeNum - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!--添加商品表单-->
        <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodFormRef" label-width="100px" label-position="top">
          <el-tabs :tab-position="'left'" v-model="activeNum" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input type="text" v-model="addGoodForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input type="text" v-model="addGoodForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input type="text" v-model="addGoodForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  expand-trigger="hover"
                  :options="cateList"
                  v-model="addGoodForm.goods_cat"
                  @change="handleChange"
                  :props="cateProps">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1" >
              <!-- 渲染表单item项 -->
              <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
                  <!-- 使用数组渲染复选框组 -->
                  <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <!-- 循环生成静态属性 -->
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!-- 商品图片上传
              action:指定图片上传api接口
              :on-preview ： 当点击图片时会触发该事件进行预览操作,处理图片预览
              :on-remove : 当用户点击图片右上角的X号时触发执行
              :on-success：当用户点击上传图片并成功上传时触发
              list-type ：设置预览图片的方式
              :headers ：设置上传图片的请求头 -->
              <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture" :headers="headerObj">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器组件 -->
              <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 预览图片对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
          <img :src="previewPath" class="previewImg" />
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 激活的步骤条ID
      activeNum: '0',
      // 添加商品表单对象
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: '0',
        goods_number: '0',
        goods_cat: [],
        // 上传图片数组
        pics: [],
        // 商品文本描述
        goods_introduce: '',
        attrs: []
      },
      // 添加商品表单验证规则
      addGoodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      cateList: [],
      // 级联选择器参数设定
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 上传图片URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的地址
      previewPath: '',
      // 控制预览图片对话框的显示与隐藏
      previewVisible: false
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
        return this.$message.error('请求商品分类数据失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 分类发生改变时触发
    handleChange() {
      console.log(this.addGoodForm.goods_cat)
      if (this.addGoodForm.goods_cat.length !== 3) {
        this.addGoodForm.goods_cat = []
      }
    },
    // 切换TAB标签时触发
    beforeTabLeave(activeName, oldName) {
      if (oldName === '0') {
        if (this.addGoodForm.goods_cat.length !== 3) {
          return false
        }
        // } else if (this.addGoodForm.goods_name.trim() === '') {
        //   this.$message.error('请输入商品名称')
        //   return false
        // } else if (this.addGoodForm.goods_price.trim() === '0') {
        //   this.$message.error('请输入商品价格')
        //   return false
        // } else if (this.addGoodForm.goods_weight.trim() === '0') {
        //   this.$message.error('请输入商品重量')
        //   return false
        // } else if (this.addGoodForm.goods_number.trim() === '0') {
        //   this.$message.error('请输入商品数量')
        //   return false
        // }
      }
    },
    // 点击标签时触发
    async tabClicked() {
      // 当用户点击切换tab栏时触发
      if (this.activeNum === '1') {
        // 发送请求获取动态参数
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        // 将attr_vals字符串转换为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeNum === '2') {
        // 发送请求获取静态属性
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败')
        }

        this.onlyTableData = res.data
      }
    },
    // 预览图片触发的函数
    handlePreview(file) {
      // 当用户点击图片进行预览时执行，处理图片预览
      // 形参file就是用户预览的那个文件
      this.previewPath = file.response.data.url
      // 显示预览图片对话框
      this.previewVisible = true
    },
    // 移除图片触发的函数
    handleRemove(file) {
      // 当用户点击X号删除时执行
      // 形参file就是用户点击删除的文件
      // 获取用户点击删除的那个图片的临时路径
      const filePath = file.response.data.tmp_path
      // 使用findIndex来查找符合条件的索引
      const index = this.addGoodForm.pics.findIndex(item => item.pic === filePath)
      // 移除索引对应的图片
      this.addGoodForm.pics.splice(index, 1)
      console.log(this.addGoodForm.pics)
    },
    // 上传成功触发的函数
    handleSuccess(response) {
      // 当上传成功时触发执行
      // 形参response就是上传成功之后服务器返回的结果
      // 将服务器返回的临时路径保存到addForm表单的pics数组中
      this.addGoodForm.pics.push({ pic: response.data.tmp_path })
    },
    // 编写点击事件完成商品添加
    add() {
      this.$refs.addGoodFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项!')
        // 将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错
        const form = _.cloneDeep(this.addGoodForm)
        // 将goods_cat从数组转换为"1,2,3"字符串形式
        form.goods_cat = form.goods_cat.join(',')
        // 处理attrs数组，数组中需要包含商品的动态参数和静态属性
        // 将manyTableData（动态参数）处理添加到attrs
        this.manyTableData.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') })
        })
        // 将onlyTableData（静态属性）处理添加到attrs
        this.onlyTableData.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })

        // 发送请求完成商品的添加,商品名称必须是唯一的
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取分类ID
    cateId() {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}

.el-checkbox {
  margin: 0 10px 0 0!important;
}
.previewImg {
  width: 100%;
}
</style>
