<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
          <el-row>
            <el-col><el-button type="primary">添加</el-button></el-col>
          </el-row>
          <el-table :data="roleList" border stripe>
            <!--扩展列-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--第一列-->
                <el-row :class="['bdbottom', id1 === 0? 'bdtop' : '', 'vcenter']" v-for="(item1, id1) in scope.row.children" :key="item1.id">
                  <el-col :span="5">
                    <el-tag closable @close="deleteRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!--第二列-->
                    <el-row :class="[id2 == 0? '' : 'bdtop', 'vcenter']" v-for="(item2, id2) in item1.children" :key="item2.id">
                      <el-col :span="6">
                      <el-tag type="success" closable @close="deleteRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                          <el-col>
                            <!--第三列-->
                            <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="deleteRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                          </el-col>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index">#</el-table-column>
            <el-table-column label='角色名称' prop='roleName'></el-table-column>
            <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
            <el-table-column label='操作'>
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
          </el-table>
          <!-- 分配用户权限对话框-->
          <el-dialog
            title="分配用户权限"
            :visible.sync="setRightdialogVisible"
            width="30%"
            @close="resetcheckedAry"
            >
            <!--树形控件-->
            <el-tree :data="rightList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="checkedAry"></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRightdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="setRoleRights">确 定</el-button>
            </span>
          </el-dialog>
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightdialogVisible: false,
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 已选中的权限ID数组
      checkedAry: [],
      // 即将分配权限的角色ID
      roleID: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取用户权限列表
    async getRoleList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    // 根据ID删除对应的权限
    async deleteRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限错误')
      }
      role.children = res.data
    },
    // 分配角色权限
    async showSetRightDialog(role) {
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表错误')
      }
      this.rightList = res.data
      this.getLeafNode(role, this.checkedAry)
      this.setRightdialogVisible = true
      this.roleID = role.id
    },
    // 递归获取已有权限的ID病加入到数组中
    getLeafNode(node, ary) {
      if (!node.children) {
        return ary.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafNode(item, ary)
      })
    },
    // 关闭分配权限对话框
    resetcheckedAry() {
      this.checkedAry = []
    },
    // 发送分配权限ID，修改权限
    async setRoleRights() {
      const rightIdAry = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const rightIdStr = rightIdAry.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleID}/rights`, { rids: rightIdStr }) // 注意post请求体的格式，错误发送能可得到200回复，但是无法获得正确的数据
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
