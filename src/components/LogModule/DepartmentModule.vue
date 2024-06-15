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
          { title: '电子邮件', dataIndex: 'email', key: 'email' },
          { title: '角色', dataIndex: 'role', key: 'role' },
          { title: '业务单元', dataIndex: 'business_unit', key: 'business_unit' },
          { title: '功能单元', dataIndex: 'functional_unit', key: 'functional_unit' },
          { title: '部门', dataIndex: 'department', key: 'department' },
          { title: '团队', dataIndex: 'team', key: 'team' },
          { title: '主管', dataIndex: 'supervisor', key: 'supervisor' },
        ],
        data: [
          { employee_name: '张三', user_id: '1001', email: 'zhangsan@example.com', role: '开发人员', business_unit: 'IT', functional_unit: '开发部', department: '研发部门', team: '团队A', supervisor: '李四' },
          { employee_name: '李四', user_id: '1002', email: 'lisi@example.com', role: '测试人员', business_unit: 'IT', functional_unit: '测试部', department: '质量保障部', team: '团队B', supervisor: '王五' },
          { employee_name: '王五', user_id: '1003', email: 'wangwu@example.com', role: '项目经理', business_unit: 'IT', functional_unit: '管理部', department: '项目管理部', team: '团队C', supervisor: '赵六' },
          { employee_name: '赵六', user_id: '1004', email: 'zhaoliu@example.com', role: '产品经理', business_unit: '市场', functional_unit: '产品部', department: '市场部', team: '团队D', supervisor: '钱七' },
          { employee_name: '钱七', user_id: '1005', email: 'qianqi@example.com', role: '设计师', business_unit: '市场', functional_unit: '设计部', department: '设计部', team: '团队E', supervisor: '孙八' },
        ],
      };
    },
  };
  </script>
  