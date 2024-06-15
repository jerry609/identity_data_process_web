<template>
    <div>
      <a-table :columns="columns" :dataSource="data" rowKey="user_id">
        <!-- Optional: Add export button and other functionality -->
      </a-table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        columns: [
          { title: '员工姓名', dataIndex: 'employee_name', key: 'employee_name' },
          { title: '用户ID', dataIndex: 'user_id', key: 'user_id' },
          { title: '开放性得分', dataIndex: 'O', key: 'O' },
          { title: '尽责性得分', dataIndex: 'C', key: 'C' },
          { title: '外向性得分', dataIndex: 'E', key: 'E' },
          { title: '宜人性得分', dataIndex: 'A', key: 'A' },
          { title: '神经质得分', dataIndex: 'N', key: 'N' },
        ],
        data: [
          { employee_name: '张三', user_id: '1001', O: 85, C: 78, E: 90, A: 72, N: 65 },
          { employee_name: '李四', user_id: '1002', O: 70, C: 82, E: 88, A: 69, N: 70 },
          { employee_name: '王五', user_id: '1003', O: 60, C: 75, E: 80, A: 85, N: 55 },
          { employee_name: '赵六', user_id: '1004', O: 95, C: 68, E: 77, A: 90, N: 45 },
          { employee_name: '钱七', user_id: '1005', O: 78, C: 85, E: 92, A: 88, N: 60 },
        ],
      };
    },
  };
  </script>
  