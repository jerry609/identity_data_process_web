<template>
    <div>
      <a-row :gutter="20">
        <a-col :span="4">
          <a-card>
            <template slot="title">组织机构</template>
            <a-tree
              :treeData="treeData"
              :defaultExpandAll="true"
              @select="handleNodeClick"
            />
          </a-card>
        </a-col>
        <a-col :span="20">
          <a-card>
            <template slot="title">
              用户活动
              <a-button type="primary" @click="handleAdd" style="float: right;">新增</a-button>
            </template>
            <a-form layout="inline" :model="filters" style="margin-bottom: 20px;">
              <a-form-item label="用户ID">
                <a-input v-model="filters.userID" placeholder="用户ID" />
              </a-form-item>
              <a-form-item label="部门">
                <a-select v-model="filters.department" placeholder="选择部门">
                  <a-select-option value="研发部门">研发部门</a-select-option>
                  <a-select-option value="测试部门">测试部门</a-select-option>
                  <a-select-option value="财务部门">财务部门</a-select-option>
                  <a-select-option value="市场部门">市场部门</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="设备类型">
                <a-select v-model="filters.deviceType" placeholder="选择设备类型">
                  <a-select-option value="计算机">计算机</a-select-option>
                  <a-select-option value="USB驱动器">USB驱动器</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="handleSearch">搜索</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-form-item>
            </a-form>
            <div style="margin-bottom: 20px;">
              <a-button type="primary" @click="handleAdd">新增</a-button>
              <a-button type="default" @click="handleEditSelected">修改</a-button>
              <a-button type="danger" @click="handleDeleteSelected">删除</a-button>
              <a-button @click="handleImport">导入</a-button>
              <a-button @click="handleExport">导出</a-button>
            </div>
            <a-table
              :rowSelection="rowSelection"
              :dataSource="filteredData"
              :pagination="false"
              rowKey="id"
            >
              <a-table-column type="selection" width="55" />
              <a-table-column title="ID" dataIndex="id" key="id" width="100" />
              <a-table-column title="事件日期时间" dataIndex="DateTime" key="DateTime" width="180" />
              <a-table-column title="用户ID" dataIndex="UserID" key="UserID" width="100" />
              <a-table-column title="用户类型" dataIndex="UserType" key="UserType" width="100" />
              <a-table-column title="部门" dataIndex="Department" key="Department" width="120" />
              <a-table-column title="计算机ID" dataIndex="PC" key="PC" width="100" />
              <a-table-column title="设备类型" dataIndex="DeviceType" key="DeviceType" width="120" />
              <a-table-column title="地点" dataIndex="Location" key="Location" width="120" />
              <a-table-column title="活动类型" dataIndex="ActivityType" key="ActivityType" width="180" />
              <a-table-column title="活动详情" dataIndex="ActionDetails" key="ActionDetails" width="180" />
              <a-table-column title="风险等级" key="RiskLevel" width="100">
                <template slot="customRender" slot-scope="text, record">
                  <a-tag :color="getRiskLevelColor(record.RiskLevel)">{{ record.RiskLevel }}</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="关联ID" dataIndex="CorrelatedID" key="CorrelatedID" width="100" />
              <a-table-column title="操作" key="action" width="180">
                <template slot="customRender" slot-scope="text, record">
                  <a-button size="small" @click="handleEdit(record)">操作</a-button>
                  <a-button size="small" type="danger" @click="handleDelete(record)">删除</a-button>
                </template>
              </a-table-column>
            </a-table>
            <a-pagination
              :current="currentPage"
              :total="total"
              :pageSize="10"
              @change="handlePageChange"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script>
  import { message } from 'ant-design-vue';
  
  export default {
    name: 'UserActivity',
    data() {
      return {
        filters: {
          userID: '',
          department: '',
          deviceType: ''
        },
        userActivities: [
          { id: 1, DateTime: '2024-06-13 09:00', UserID: 'U123', UserType: '员工', Department: '研发部门', PC: 'PC001', DeviceType: '计算机', Location: '办公室', ActivityType: '登录', ActionDetails: '成功登录系统', RiskLevel: '低', CorrelatedID: 'C123' },
          { id: 2, DateTime: '2024-06-13 10:00', UserID: 'U124', UserType: '销售', Department: '测试部门', PC: 'PC002', DeviceType: '计算机', Location: '办公室', ActivityType: '文件操作', ActionDetails: '修改文件', RiskLevel: '中', CorrelatedID: 'C124' },
          { id: 3, DateTime: '2024-06-14 09:30', UserID: 'U125', UserType: '经理', Department: '财务部门', PC: 'PC003', DeviceType: 'USB驱动器', Location: '办公室', ActivityType: '设备连接', ActionDetails: '连接USB驱动器', RiskLevel: '高', CorrelatedID: 'C125' },
          { id: 4, DateTime: '2024-06-15 14:20', UserID: 'U126', UserType: '员工', Department: '研发部门', PC: 'PC004', DeviceType: '计算机', Location: '办公室', ActivityType: '登录', ActionDetails: '失败登录', RiskLevel: '高', CorrelatedID: 'C126' }
        ],
        currentPage: 1,
        total: 0,
        selectedRowKeys: [],
        selectedRows: [],
        treeData: [
          {
            title: 'xx科技',
            key: '0-0',
            children: [
              {
                title: '深圳分公司',
                key: '0-0-0',
                children: [
                  { title: '研发部门', key: '0-0-0-0' },
                  { title: '测试部门', key: '0-0-0-1' },
                  { title: '财务部门', key: '0-0-0-2' }
                ]
              },
              {
                title: '长沙分公司',
                key: '0-0-1',
                children: [
                  { title: '市场部门', key: '0-0-1-0' },
                  { title: '财务部门', key: '0-0-1-1' }
                ]
              }
            ]
          }
        ]
      };
    },
    computed: {
      filteredData() {
        let filtered = this.userActivities;
        if (this.filters.userID) {
          filtered = filtered.filter(activity => activity.UserID.includes(this.filters.userID));
        }
        if (this.filters.department) {
          filtered = filtered.filter(activity => activity.Department === this.filters.department);
        }
        if (this.filters.deviceType) {
          filtered = filtered.filter(activity => activity.DeviceType === this.filters.deviceType);
        }
        return filtered.slice((this.currentPage - 1) * 10, this.currentPage * 10);
      },
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.handleSelectionChange
        };
      }
    },
    watch: {
      filters: {
        handler() {
          this.currentPage = 1;
          this.updateTotal();
        },
        deep: true
      },
      currentPage() {
        this.updateTotal();
      }
    },
    methods: {
      handleAdd() {
        message.success('新增逻辑处理');
      },
      handleEdit(record) {
        message.success(`编辑逻辑处理: ${record.id}`);
      },
      handleDelete(record) {
        message.error(`删除逻辑处理: ${record.id}`);
      },
      handleEditSelected() {
        message.success(`编辑选中的逻辑处理: ${this.selectedRows.map(row => row.id).join(', ')}`);
      },
      handleDeleteSelected() {
        message.error(`删除选中的逻辑处理: ${this.selectedRows.map(row => row.id).join(', ')}`);
      },
      handleImport() {
        message.success('导入逻辑处理');
      },
      handleExport() {
        message.success('导出逻辑处理');
      },
      handleSearch() {
        this.currentPage = 1;
      },
      handleReset() {
        this.filters = {
          userID: '',
          department: '',
          deviceType: ''
        };
        this.handleSearch();
      },
      handlePageChange(page) {
        this.currentPage = page;
      },
      handleSelectionChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      handleNodeClick(selectedKeys, { node }) {
        if (node.children) {
          this.filters.department = '';
        } else {
          this.filters.department = node.title;
        }
        this.currentPage = 1;
      },
      updateTotal() {
        let filtered = this.userActivities;
        if (this.filters.userID) {
          filtered = filtered.filter(activity => activity.UserID.includes(this.filters.userID));
        }
        if (this.filters.department) {
          filtered = filtered.filter(activity => activity.Department === this.filters.department);
        }
        if (this.filters.deviceType) {
          filtered = filtered.filter(activity => activity.DeviceType === this.filters.deviceType);
        }
        this.total = filtered.length;
      },
      getRiskLevelColor(level) {
        switch (level) {
          case '高':
            return 'red';
          case '中':
            return 'orange';
          case '低':
            return 'green';
          default:
            return 'blue';
        }
      }
    },
    mounted() {
      this.updateTotal();
    }
  };
  </script>
  
  <style scoped>
  .demo-form-inline .ant-form-item {
    margin-right: 20px;
  }
  </style>
  