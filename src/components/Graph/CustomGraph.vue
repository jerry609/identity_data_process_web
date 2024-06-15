<!-- src/components/CustomGraph.vue -->
<template>
    <div class="chart-container">
      <div ref="chart" :style="{ width: '100%', height: '800px' }"></div>
    </div>
  </template>
  
  <script>

  import * as echarts from 'echarts';
  export default {
    name: 'CustomGraph',
    data() {
      return {
        chart: null // 用于保存ECharts实例
      };
    },
    mounted() {
      this.initChart(); // 组件挂载后初始化图表
    },
    methods: {
      initChart() {
        // 初始化ECharts实例
        this.chart = echarts.init(this.$refs.chart);
        this.chart.showLoading(); // 显示加载动画
  
        // 定义节点和链接
        let nodes = [
          { id: 'User1', name: 'User1', category: 0, symbolSize: 50 },
          { id: 'Device1', name: 'Device1', category: 1, symbolSize: 40 },
          { id: 'Device2', name: 'Device2', category: 1, symbolSize: 40 },
          { id: '系统安全', name: '系统安全', category: 2, symbolSize: 30 },
          { id: '登录时间', name: '登录时间', category: 3, symbolSize: 30 },
          { id: '系统登录', name: '系统登录', category: 3, symbolSize: 30 },
          { id: 'ID', name: 'ID', category: 3, symbolSize: 20 },
          { id: '名字', name: '名字', category: 3, symbolSize: 20 },
          { id: '所属部门', name: '所属部门', category: 3, symbolSize: 20 },
          { id: '职务', name: '职务', category: 3, symbolSize: 20 },
          { id: '心理状况', name: '心理状况', category: 3, symbolSize: 20 },
          { id: '文件修改时间', name: '文件修改时间', category: 2, symbolSize: 20 },
          { id: '文件名', name: '文件名', category: 2, symbolSize: 20 },
          { id: '文件创建时间', name: '文件创建时间', category: 2, symbolSize: 20 },
          { id: '文件保存时间', name: '文件保存时间', category: 2, symbolSize: 20 },
          { id: '收件人姓名', name: '收件人姓名', category: 2, symbolSize: 20 },
          { id: '收件人地址', name: '收件人地址', category: 2, symbolSize: 20 },
          { id: '收件人证件', name: '收件人证件', category: 2, symbolSize: 20 },
          { id: '收件人职务', name: '收件人职务', category: 2, symbolSize: 20 },
          { id: '发件人', name: '发件人', category: 2, symbolSize: 20 }
        ];
  
        let links = [
          { source: 'User1', target: 'Device1' },
          { source: 'User1', target: 'Device2' },
          { source: 'Device1', target: '系统安全' },
          { source: 'Device1', target: '登录时间' },
          { source: 'Device1', target: '系统登录' },
          { source: 'Device2', target: '系统安全' }, // 增加Device2的连接
          { source: 'Device2', target: '登录时间' }, // 增加Device2的连接
          { source: 'Device2', target: '系统登录' }, // 增加Device2的连接
          { source: '系统登录', target: 'ID' },
          { source: '系统登录', target: '名字' },
          { source: '系统登录', target: '所属部门' },
          { source: '系统登录', target: '职务' },
          { source: '系统登录', target: '心理状况' },
          { source: '系统登录', target: '登录时间' },
          { source: '系统登录', target: '登录许可' },
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
        ];
  
        // 配置ECharts图表选项
        let option = {
          tooltip: {}, // 提示框组件
          legend: [
            {
              data: ['User', 'Device', '系统安全', '系统登录'] // 图例数据
            }
          ],
          animationDuration: 1500, // 动画持续时间
          animationEasingUpdate: 'quinticInOut', // 动画缓动效果
          series: [
            {
              name: 'Custom Graph', // 系列名称
              type: 'graph', // 系列类型: 图
              layout: 'force', // 图的布局: 力引导布局
              data: nodes, // 节点数据
              links: links, // 边数据
              categories: [
                { name: 'User', itemStyle: { color: '#FF0000' } },
                { name: 'Device', itemStyle: { color: '#00FF00' } },
                { name: '系统安全', itemStyle: { color: '#0000FF' } },
                { name: '系统登录', itemStyle: { color: '#FFA500' } }
              ],
              roam: true, // 开启缩放和平移
              label: {
                show: true, // 显示标签
                position: 'right', // 标签位置
                formatter: '{b}' // 标签格式
              },
              force: {
                repulsion: 1000, // 节点之间的斥力因子
                edgeLength: [50, 100] // 边的两个节点之间的距离
              },
              lineStyle: {
                color: 'source', // 边的颜色
                curveness: 0.3 // 边的曲度
              },
              emphasis: {
                focus: 'adjacency', // 高亮相连节点和边
                lineStyle: {
                  width: 10 // 高亮边的宽度
                }
              }
            }
          ]
        };
  
        // 设置图表选项并隐藏加载动画
        this.chart.setOption(option);
        this.chart.hideLoading();
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%; /* 将图表高度设置为视口高度 */
  }
  </style>