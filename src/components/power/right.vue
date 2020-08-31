<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片式图区域-->
      <el-card>
        <el-table :data="RightList" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
              <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
              <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      RightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      this.RightList = res.data
      console.log(this.RightList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
