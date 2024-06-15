<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="250px" style="background-color: #f5f7fa; border-right: 1px solid #ebeef5;">
      <el-menu :default-openeds="['1', '2', '3']" class="el-menu-vertical-demo" background-color="#f5f7fa"
        text-color="#333" active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-data"></i> 数据引接
          </template>
          <el-submenu index="1-1">
            <template slot="title"><i class="el-icon-s-help"></i> 身份发现数据</template>
            <el-menu-item index="2-1-1" @click="navigateTo('FileList')"><i class="el-icon-document"></i>
              选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="1-2">
            <template slot="title"><i class="el-icon-s-check"></i> 身份关联数据</template>
            <el-menu-item index="1-2-1" @click="navigateTo()"><i class="el-icon-document"></i> 选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-platform"></i> 多源数据模块
          </template>
          <el-submenu index="2-1">
            <template slot="title"><i class="el-icon-s-data"></i> 身份发现数据处理</template>
            <el-menu-item index="2-1-1" @click="navigateTo('UserActivity')"><i class="el-icon-user"></i>
              用户管理</el-menu-item>
            <el-submenu index="2-1-2">
              <template slot="title"><i class="el-icon-s-operation"></i> 日志管理</template>
              <el-menu-item index="2-1-2-1" @click="navigateTo('LogInfo')"><i class="el-icon-document"></i>
                操作日志</el-menu-item>
            </el-submenu>
            <el-submenu index="2-1-3">
              <template slot="title"><i class="el-icon-s-operation"></i>字段处理</template>
              <el-menu-item index="2-1-3-1" @click="navigateTo('Clean')"><i class="el-icon-folder"></i> 数据预处理</el-menu-item>
              <el-menu-item index="2-1-3-2" @click="navigateTo('DataSearch')"><i class="el-icon-search"></i> 数据检索</el-menu-item>
              <!-- <el-menu-item index="2-1-3-3" @click="navigateTo('')"><i class="el-icon-document"></i> 字段类型转换</el-menu-item> -->
              <el-menu-item index="2-1-3-4" @click="navigateTo('FillData')"><i class="el-icon-edit"></i> 缺失值处理</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2-2">
            <template slot="title"><i class="el-icon-s-unfold"></i> 身份关联数据处理</template>
            <el-menu-item index="2-2-1"><i class="el-icon-document"></i> 选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i> 身份发现模块
          </template>
          <el-submenu index="3-1">
            <template slot="title"><i class="el-icon-s-claim"></i> 身份发现展示</template>
            <el-menu-item index="3-1-1" @click="navigateTo('CustomGraph')"><i class="el-icon-graph"></i>
              选项1</el-menu-item>
            <el-menu-item index="3-1-2" @click="navigateTo('demo')"><i class="el-icon-document"></i> 选项2</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        style="text-align: right; font-size: 14px; background-color: #f5f7fa; border-bottom: 1px solid #ebeef5; padding: 0 20px;">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-setting" style="margin-right: 10px;"></i> 设置
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>demo</span>
      </el-header>

      <el-main style="padding: 20px; background-color: #fff;">
        <router-view :nodes="nodes" :links="links"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      nodes: [
        { id: 'User1', group: 1 },
        { id: 'Device1', group: 2 },
        { id: 'Device2', group: 2 },
        { id: '系统安全', group: 3 },
        { id: '登录时间', group: 4 },
        { id: '系统登录', group: 4 },
        { id: 'ID', group: 4 },
        { id: '名字', group: 4 },
        { id: '所属部门', group: 4 },
        { id: '职务', group: 4 },
        { id: '心理状况', group: 4 },
        { id: '文件修改时间', group: 3 },
        { id: '文件名', group: 3 },
        { id: '文件创建时间', group: 3 },
        { id: '文件保存时间', group: 3 },
        { id: '收件人姓名', group: 3 },
        { id: '收件人地址', group: 3 },
        { id: '收件人证件', group: 3 },
        { id: '收件人职务', group: 3 },
        { id: '发件人', group: 3 }
      ],
      links: [
        { source: 'User1', target: 'Device1' },
        { source: 'User1', target: 'Device2' },
        { source: 'Device1', target: '系统安全' },
        { source: 'Device1', target: '登录时间' },
        { source: 'Device1', target: '系统登录' },
        { source: 'Device2', target: '系统安全' },
        { source: 'Device2', target: '登录时间' },
        { source: 'Device2', target: '系统登录' },
        { source: '系统登录', target: 'ID' },
        { source: '系统登录', target: '名字' },
        { source: '系统登录', target: '所属部门' },
        { source: '系统登录', target: '职务' },
        { source: '系统登录', target: '心理状况' },
        { source: '系统登录', target: '文件修改时间' },
        { source: '系统登录', target: '文件名' },
        { source: '系统登录', target: '文件创建时间' },
        { source: '系统登录', target: '文件保存时间' },
        { source: '系统安全', target: '文件修改时间' },
        { source: '系统安全', target: '文件名' },
        { source: '系统安全', target: '文件创建时间' },
        { source: '系统安全', target: '文件保存时间' },
        { source: '系统安全', target: '收件人姓名' },
        { source: '系统安全', target: '收件人地址' },
        { source: '系统安全', target: '收件人证件' },
        { source: '系统安全', target: '收件人职务' },
        { source: '系统安全', target: '发件人' }
      ]
    };
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
};
</script>

<style>
.el-header {
  background-color: #f5f7fa;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
}

.el-aside {
  color: #333;
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
}

.el-menu-vertical-demo {
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
}

.el-menu-vertical-demo .el-submenu__title {
  padding: 10px 20px;
}

.el-menu-vertical-demo .el-menu-item {
  padding: 10px 20px;
}

.el-main {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-dropdown-link {
  cursor: pointer;
  display: inline-block;
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
  transition: all 0.3s;
  user-select: none;
}
</style>
