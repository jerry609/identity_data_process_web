<template>
    <div style="display: flex;">
      <!-- Left Side: Data Table Section -->
      <div style="flex: 2; margin-right: 20px;">
        <a-card title="缺失值处理">
          <a-table
            :dataSource="tableData"
            :columns="columns"
            rowKey="id"
            :pagination="{ pageSize: 10 }"
          />
        </a-card>
      </div>
  
      <!-- Right Side: Operation Form -->
      <div style="flex: 1;">
        <a-card title="操作表单">
          <a-form :form="form" layout="vertical">
            <a-form-item label="数据表" required>
              <a-select v-model="dataTable" placeholder="请选择数据表" style="width: 100%;">
                <a-select-option value="device">device</a-select-option>
                <!-- Add more options as needed -->
              </a-select>
            </a-form-item>
  
            <a-form-item label="自变量" required>
              <a-input v-model="independentVariable" placeholder="请输入自变量" />
            </a-form-item>
  
            <a-form-item label="策略" required>
              <a-select v-model="strategy" placeholder="请选择策略" style="width: 100%;">
                <a-select-option value="mean">mean</a-select-option>
                <!-- Add more options as needed -->
              </a-select>
            </a-form-item>
  
            <a-form-item>
              <a-button type="primary" @click="calculate" block>计算</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const form = ref(null);
      const dataTable = ref('device');
      const independentVariable = ref('');
      const strategy = ref('mean');
  
      const tableData = ref([
        { id: '1', date: '01/02/2010 07:21:06', user: 'MOH0273', pc: 'PC-6699', activity: 'Connect' },
        { id: '2', date: '01/02/2010 07:37:41', user: 'MOH0273', pc: 'PC-6699', activity: 'Disconnect' },
        // Add more data as needed
      ]);
  
      const columns = ref([
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'date', dataIndex: 'date', key: 'date' },
        { title: 'user', dataIndex: 'user', key: 'user' },
        { title: 'pc', dataIndex: 'pc', key: 'pc' },
        { title: 'activity', dataIndex: 'activity', key: 'activity' },
      ]);
  
      const calculate = () => {
        console.log('计算');
        // Add your calculation logic here
      };
  
      return {
        form,
        dataTable,
        independentVariable,
        strategy,
        tableData,
        columns,
        calculate,
      };
    },
  };
  </script>
  
  <style>
  /* Add any additional styles here if needed */
  </style>
  