<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="12">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" style="width: 100%" stripe border>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0
    }
  },
  created() {
    this.getUsersData()
  },
  methods: {
    async getUsersData() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求发生错误')
      }
      this.usersList = res.data.users
      this.total = res.data.toal
    }
  }
}
</script>

<style lang="less" scoped>
</style>
