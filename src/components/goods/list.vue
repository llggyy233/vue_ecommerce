<template>
  <div>
        <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--顶部搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品列表-->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeItemById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    },
    // 显示页数改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 当前页改变时触发
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodList()
    },
    // 通过ID删除商品
    async removeItemById(item) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除商品')
      }
      const { data: res } = await this.$axios.delete(`goods/${item.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodList()
    },
    // 点击添加按钮，跳转到添加页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin: 10px 0;
}
</style>
