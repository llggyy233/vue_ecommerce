<template>
  <div>
        <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取列表请求信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品种类总数
      total: 0,
      // 商品列表数据
      goodList: []
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    async getGoodList() {
      const { data: res } = await this.$axios.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('请求列表信息失败')
      }
      this.total = res.data.total
      this.goodList = res.data.goods
      console.log(this.goodList)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
