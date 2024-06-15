<template>
  <div>
    <a-card>
      <!-- Form Container with styles -->
      <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
        <a-form :form="form" @submit.prevent="handleSubmit" layout="vertical">
          <a-row>
            <a-col :span="24">
              <a-form-item label="选择数据" required>
                <a-select v-model="dataTable" placeholder="请选择数据表" style="width: 100%;">
                  <a-select-option value="device">device</a-select-option>
                  <!-- Add more options as needed -->
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item label="条件" required>
                <a-row gutter={16}>
                  <a-col :span="5">
                    <a-input v-model="field" placeholder="选择字段" />
                  </a-col>
                  <a-col :span="5">
                    <a-input v-model="leftValue" placeholder="左侧值" />
                  </a-col>
                  <a-col :span="5">
                    <a-select v-model="condition" placeholder="请选择" style="width: 100%;">
                      <a-select-option value="equals">等于</a-select-option>
                      <a-select-option value="notEquals">不等于</a-select-option>
                      <!-- Add more conditions as needed -->
                    </a-select>
                  </a-col>
                  <a-col :span="5">
                    <a-input v-model="rightValue" placeholder="右侧值" />
                  </a-col>
                  <a-col :span="2">
                    <a-button type="primary" @click="addCondition" style="width: 100%;">+</a-button>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row style="margin-top: 20px;">
            <a-col :span="24">
              <a-form-item>
                <a-button type="default" @click="groupConditions" style="margin-right: 10px; background-color: #4caf50; border-color: #4caf50; color: #fff;">条件分组</a-button>
                <a-button type="default" @click="addCondition" style="margin-right: 10px; background-color: #4caf50; border-color: #4caf50; color: #fff;">追加条件</a-button>
                <a-button type="default" @click="clearConditions" style="margin-right: 10px; background-color: #4caf50; border-color: #4caf50; color: #fff;">清空条件</a-button>
                <a-button type="default" @click="search" style="margin-right: 10px; background-color: #4caf50; border-color: #4caf50; color: #fff;">搜索</a-button>
                <a-button type="default" @click="saveData" style="background-color: #4caf50; border-color: #4caf50; color: #fff;">数据保存</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const form = ref(null);
    const dataTable = ref('');
    const field = ref('');
    const leftValue = ref('');
    const condition = ref('');
    const rightValue = ref('');

    const handleSubmit = () => {
      console.log('Form submitted');
    };

    const addCondition = () => {
      console.log('追加条件');
    };

    const groupConditions = () => {
      console.log('条件分组');
    };

    const clearConditions = () => {
      console.log('清空条件');
    };

    const search = () => {
      console.log('搜索');
    };

    const saveData = () => {
      console.log('数据保存');
    };

    return {
      form,
      dataTable,
      field,
      leftValue,
      condition,
      rightValue,
      handleSubmit,
      addCondition,
      groupConditions,
      clearConditions,
      search,
      saveData
    };
  }
};
</script>

<style>
/* Add any additional styles here if needed */
</style>
