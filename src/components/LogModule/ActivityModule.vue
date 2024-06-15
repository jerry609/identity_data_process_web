<template>
    <div>
      <a-table :columns="columns" :dataSource="data" rowKey="id">
        <template #title>
          <div>
            <a-button type="primary" @click="handleExport">导出</a-button>
            <a-upload
              :beforeUpload="handleImport"
              showUploadList="false"
            >
              <a-button type="primary" style="margin-left: 10px;">导入</a-button>
            </a-upload>
          </div>
        </template>
      </a-table>
    </div>
  </template>
  
  <script>
  import Papa from 'papaparse';
  
  export default {
    data() {
      return {
        columns: [
          { title: '日志编号', dataIndex: 'id', key: 'id' },
          { title: '系统模块', dataIndex: 'module', key: 'module' },
          { title: '操作类型', dataIndex: 'type', key: 'type' },
          { title: '操作人员', dataIndex: 'user', key: 'user' },
          { title: '部门名称', dataIndex: 'department', key: 'department' },
          { title: '操作地址', dataIndex: 'address', key: 'address' },
          { title: '操作状态', key: 'status', scopedSlots: { customRender: 'status' } },
          { title: '操作时间', dataIndex: 'time', key: 'time' },
        ],
        data: [
          { id: '1093', module: '代码生成', type: '生成代码', user: 'admin', department: '研发部门', address: '202.100.205.245', status: '成功', time: '2024-06-13 15:21:23' },
          { id: '1092', module: '在线用户', type: '登录', user: 'admin', department: '研发部门', address: '221.232.168.110', status: '强退', time: '2024-06-13 15:21:15' },
          { id: '1091', module: '在线用户', type: '登录', user: 'admin', department: '研发部门', address: '221.232.168.110', status: '强退', time: '2024-06-13 15:21:10' },
          { id: '1090', module: '在线用户', type: '登录', user: 'admin', department: '研发部门', address: '221.232.168.110', status: '强退', time: '2024-06-13 15:21:07' },
          { id: '1089', module: '在线用户', type: '登录', user: 'admin', department: '研发部门', address: '221.232.168.110', status: '强退', time: '2024-06-13 15:21:04' },
        ],
      };
    },
    methods: {
      handleExport() {
        // Handle export functionality
      },
      handleImport(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target.result;
          Papa.parse(csvData, {
            header: true,
            complete: (result) => {
              this.data = result.data.map((item, index) => ({
                id: item['日志编号'] || index.toString(),
                module: item['系统模块'],
                type: item['操作类型'],
                user: item['操作人员'],
                department: item['部门名称'],
                address: item['操作地址'],
                status: item['操作状态'],
                time: item['操作时间'],
              }));
            },
            error: (error) => {
              console.error('Error parsing CSV:', error);
            },
          });
        };
        reader.readAsText(file);
        return false; // Prevent upload
      },
      getStatusTag(status) {
        switch (status) {
          case '成功':
            return 'green';
          case '强退':
            return 'red';
          default:
            return 'blue';
        }
      },
    },
  };
  </script>
  
  <template>
    <a-table :columns="columns" :dataSource="data" rowKey="id">
      <template slot="status" slot-scope="text, record">
        <a-tag :color="getStatusTag(record.status)">{{ record.status }}</a-tag>
      </template>
    </a-table>
  </template>
  
  <style scoped>
  .demo-form-inline .ant-form-item {
    margin-right: 20px;
  }
  </style>
  