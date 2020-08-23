<template>
  <el-container class="home_container">
    <!-- 头部区域-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-collpase" @click="toggleCollapse">
          |||
        </div>
        <!-- 侧边栏菜单区域-->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!--一级菜单-->
          <el-submenu :index="items.id + ''" v-for="items in menulist" :key="items.id">
            <template slot="title">
              <!--图标-->
              <i :class="icons[items.id]"></i>
              <!--文本-->
              <span>{{items.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item-group>
              <el-menu-item :index="subitems.id + ''" v-for="subitems in items.children" :key="subitems.id">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subitems.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  // 实例创建完成后被立即调用
  created() {
    this.getmenulist()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getmenulist() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.menulist = res.data
      console.log(res.data)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #373d41;
  padding-left: 0;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 5px;
}
.toggle-collpase{
  width: 100%;
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>
