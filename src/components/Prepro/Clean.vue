<template>
    <div>
      <a-card>
        <!-- Form Container with styles -->
        <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
          <a-form :form="form" @submit.prevent="handleSubmit" layout="inline">
            <a-form-item label="数据表" required>
              <a-select v-model="dataTable" placeholder="请选择数据表">
                <a-select-option value="device">device</a-select-option>
                <!-- Add more options as needed -->
              </a-select>
            </a-form-item>
  
            <a-form-item label="样本数" required>
              <a-input-number v-model="sampleCount" :min="1" />
            </a-form-item>
  
            <a-form-item>
              <a-button type="primary" @click="handlePreview" style="margin-right: 10px; background-color: #4caf50; border-color: #4caf50; border-radius: 5px; color: #fff;">预览样本</a-button>
              <a-button type="default" @click="showDataDetails" style="margin-right: 10px; background-color: #2196f3; border-color: #2196f3; border-radius: 5px; color: #fff;">显示数据细节</a-button>
              <a-button type="default" @click="deleteFieldBatch" style="margin-right: 10px; background-color: #f44336; border-color: #f44336; border-radius: 5px; color: #fff;">字段批量删除</a-button>
              <a-button type="default" @click="generateData" style="margin-right: 10px; background-color: #ff9800; border-color: #ff9800; border-radius: 5px; color: #fff;">生成数据</a-button>
            </a-form-item>
          </a-form>
        </div>
  
        <a-table :dataSource="tableData" :columns="columns" rowKey="id" :pagination="{ pageSize: 10 }">
          <template slot="操作" slot-scope="text, record">
            <a-button type="link" @click="viewData(record)" style="color: #4caf50; border: 1px solid #4caf50; border-radius: 5px; margin-right: 5px;">浏览缺失数据</a-button>
            <a-button type="link" @click="deleteSample(record.id)" style="color: #f44336; border: 1px solid #f44336; border-radius: 5px; margin-right: 5px;">删除缺失样本</a-button>
            <a-button type="link" @click="deleteCondition(record.id)" style="color: #2196f3; border: 1px solid #2196f3; border-radius: 5px; margin-right: 5px;">条件删除</a-button>
          </template>
          <template slot="type" slot-scope="text, record">
            <a-switch v-model="record.type" @change="handleTypeChange(record)" />
          </template>
        </a-table>
      </a-card>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const form = ref(null);
      const dataTable = ref('');
      const sampleCount = ref(1);
      const tableData = ref([
        { id: 47469, name: 'id', description: 'id', type: true, missingValues: 0, createdTime: '2024-06-14 10:22:18' },
        { id: 47470, name: 'date', description: 'date', type: true, missingValues: 0, createdTime: '2024-06-14 10:22:18' },
        { id: 47471, name: 'user', description: 'user', type: true, missingValues: 0, createdTime: '2024-06-14 10:22:18' },
        { id: 47472, name: 'pc', description: 'pc', type: true, missingValues: 0, createdTime: '2024-06-14 10:22:18' },
        { id: 47473, name: 'activity', description: 'activity', type: true, missingValues: 0, createdTime: '2024-06-14 10:22:18' }
      ]);
  
      const columns = ref([
        { title: '序号', dataIndex: 'id', key: 'id' },
        { title: '字段名称（英文）- 可编辑', dataIndex: 'name', key: 'name' },
        { title: '字段描述（中文）- 可编辑', dataIndex: 'description', key: 'description' },
        { title: '字段类型 - 可修改', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
        { title: '缺失值数量', dataIndex: 'missingValues', key: 'missingValues' },
        { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: '操作' } }
      ]);
  
      const handleSubmit = () => {
        console.log('Form submitted');
      };
  
      const handlePreview = () => {
        console.log('预览样本');
      };
  
      const showDataDetails = () => {
        console.log('显示数据细节');
      };
  
      const deleteFieldBatch = () => {
        console.log('字段批量删除');
      };
  
      const generateData = () => {
        console.log('生成数据');
      };
  
      const viewData = (record) => {
        console.log('浏览缺失数据', record);
      };
  
      const deleteSample = (id) => {
        console.log('删除缺失样本', id);
      };
  
      const deleteCondition = (id) => {
        console.log('条件删除', id);
      };
  
      const handleTypeChange = (record) => {
        console.log('字段类型变更:', record);
      };
  
      return {
        form,
        dataTable,
        sampleCount,
        tableData,
        columns,
        handleSubmit,
        handlePreview,
        showDataDetails,
        deleteFieldBatch,
        generateData,
        viewData,
        deleteSample,
        deleteCondition,
        handleTypeChange
      };
    }
  };
  </script>
  
  <style>
  /* Add any additional styles here if needed */
  </style>
  