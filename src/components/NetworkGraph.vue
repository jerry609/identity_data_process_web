<template>
  <div class="network-graph">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <h1 class="title">用户关系网络</h1>
          <div class="controls">
            <el-select v-model="colorScheme" placeholder="选择颜色方案" class="color-scheme-select">
              <el-option
                  v-for="item in colorSchemeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <el-button-group>
              <el-tooltip content="适应视图" placement="top">
                <el-button @click="fitView" icon="el-icon-full-screen" type="primary"></el-button>
              </el-tooltip>
              <el-tooltip content="重置缩放" placement="top">
                <el-button @click="resetZoom" icon="el-icon-refresh" type="primary"></el-button>
              </el-tooltip>
            </el-button-group>
            <el-button @click="restoreFullGraph" type="primary">恢复完整图</el-button>
          </div>
        </div>
      </template>
      <div id="g6-container" class="graph-container" ref="graphContainer"></div>
    </el-card>

    <el-drawer
        :visible.sync="drawerVisible"
        :with-header="false"
        size="30%"
        class="node-details-drawer">
      <el-card v-if="selectedNode" class="node-details">
        <template #header>
          <div class="card-header">
            <span>节点详情</span>
            <el-button class="close-button" icon="el-icon-close" @click="closeDrawer" circle></el-button>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ selectedNode.id }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ selectedNode.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedNode.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ selectedNode.role }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ selectedNode.department }}</el-descriptions-item>
          <el-descriptions-item label="团队">{{ selectedNode.team }}</el-descriptions-item>
          <el-descriptions-item label="主管">{{ selectedNode.supervisor }}</el-descriptions-item>
          <el-descriptions-item label="异常分数">{{ selectedNode.anomalyScore.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="已知异常">
            {{ selectedNode.isKnownAnomaly ? '是' : '否' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
// import axios from 'axios'; // 移除 axios 导入
import { get } from '../services/api'; // 导入我们的 API 服务
import G6 from '@antv/g6';

export default {
  name: 'NetworkGraph',
  data() {
    return {
      graph: null,
      graphData: null,
      originalGraphData: null,
      colorScheme: 'default',
      colorSchemeOptions: [
        { value: 'default', label: '默认' },
        { value: 'department', label: '部门' },
        { value: 'role', label: '角色' },
        { value: 'anomalous', label: '异常状态' }
      ],
      selectedNode: null,
      drawerVisible: false,
      selectedNodeId: null,
      departmentColors: {
        'FieldService': '#FF6B6B',
        'SoftwareManagement': '#4ECDC4',
        'Security': '#45B7D1',
        'Sales': '#FFA07A',
        'Research': '#98FB98',
        'Engineering': '#DDA0DD',
        'Assembly': '#FFD700',
        'Contracts': '#20B2AA',
        'Training': '#BA55D3'
      },
      roleColors: {
        'Salesman': '#FF6B6B',
        'ITAdmin': '#4ECDC4',
        'Technician': '#45B7D1'
      },
      // 模拟数据，用于API调用失败时的回退
      mockData: {
        nodes: [
          { id: '1', employeeName: '张三', email: 'zhangsan@example.com', role: 'ITAdmin', department: 'IT - SoftwareManagement', team: 'Dev', supervisor: '李四', anomalyScore: 0.85, isKnownAnomaly: true },
          { id: '2', employeeName: '李四', email: 'lisi@example.com', role: 'ITAdmin', department: 'IT - SoftwareManagement', team: 'Dev', supervisor: '王五', anomalyScore: 0.15, isKnownAnomaly: false },
          { id: '3', employeeName: '王五', email: 'wangwu@example.com', role: 'Technician', department: 'IT - Security', team: 'DevOps', supervisor: '', anomalyScore: 0.75, isKnownAnomaly: true },
          { id: '4', employeeName: '赵六', email: 'zhaoliu@example.com', role: 'Salesman', department: 'Business - Sales', team: 'East', supervisor: '王五', anomalyScore: 0.35, isKnownAnomaly: false },
          { id: '5', employeeName: '钱七', email: 'qianqi@example.com', role: 'Technician', department: 'IT - Engineering', team: 'QA', supervisor: '李四', anomalyScore: 0.55, isKnownAnomaly: false }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '2', target: '5' },
          { source: '1', target: '5' }
        ]
      }
    };
  },
  methods: {
    createG6Graph() {
      // 确保DOM已就绪
      if (!this.$refs.graphContainer) {
        console.error('graphContainer不存在，可能DOM尚未渲染完成');
        return;
      }

      this.registerCustomNode();

      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        itemTypes: ['node'],
        getContent: (e) => {
          const model = e.item.getModel();
          return `
            <div style="padding: 10px; background: #fff; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
              <h4>${model.employeeName}</h4>
              <p>ID: ${model.id}</p>
              <p>角色: ${model.role}</p>
              <p>部门: ${model.department}</p>
              <p>异常分数: ${model.anomalyScore.toFixed(2)}</p>
              <p>已知异常: ${model.isKnownAnomaly ? '是' : '否'}</p>
            </div>
          `;
        },
      });

      this.graph = new G6.Graph({
        container: this.$refs.graphContainer,
        width: this.$refs.graphContainer.clientWidth,
        height: 600,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'activate-relations']
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 200,
          nodeStrength: -30,
        },
        defaultNode: {
          type: 'circle-with-menu',
          size: 50,
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
            lineWidth: 2,
          },
          labelCfg: {
            style: {
              fill: '#000',
              fontSize: 12,
              fontWeight: 'bold',
            }
          }
        },
        defaultEdge: {
          style: {
            stroke: '#aaa',
            lineWidth: 1,
            opacity: 0.5
          }
        },
        plugins: [tooltip]
      });

      this.graph.on('node:click', evt => {
        const node = evt.item;
        const model = node.getModel();

        // 关闭之前节点的菜单
        if (this.selectedNodeId && this.selectedNodeId !== model.id) {
          const prevNode = this.graph.findById(this.selectedNodeId);
          if (prevNode) {
            this.graph.updateItem(prevNode, { showMenu: false });
          }
        }

        this.selectedNodeId = model.id;

        // 更新当前节点的 showMenu 属性为 true
        this.graph.updateItem(node, { showMenu: true });

        this.graph.paint();
      });

      this.graph.on('canvas:click', () => {
        if (this.selectedNodeId) {
          const node = this.graph.findById(this.selectedNodeId);
          if (node) {
            this.graph.updateItem(node, {
              showMenu: false,
            });
          }
          this.selectedNodeId = null;
          this.graph.paint();
        }
        this.drawerVisible = false;
      });
    },
    registerCustomNode() {
      const self = this;
      G6.registerNode('circle-with-menu', {
        draw(cfg, group) {
          const r = cfg.size / 2 || 25;

          // 主圆形节点
          const mainCircle = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: cfg.style.fill || '#DEE9FF',
              stroke: cfg.style.stroke || '#5B8FF9',
              lineWidth: 2,
            },
            name: 'main-circle',
          });

          // 标签
          if (cfg.label) {
            group.addShape('text', {
              attrs: {
                text: cfg.label,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fill: '#000',
                fontSize: 12,
                fontWeight: 'bold',
              },
              name: 'label',
            });
          }

          // 菜单项数据，使用文字替代缺失的图标
          const menuItems = [
            { label: '详情', action: 'details', bgColor: '#FFDDC1', iconText: 'i' },
            { label: '编辑', action: 'edit', bgColor: '#FFC0CB', iconText: 'E' },
            { label: '删除', action: 'delete', bgColor: '#FF9999', iconText: 'D' },
            { label: '子图', action: 'displaySubgraph', bgColor: '#D3FFCE', iconText: 'S' },
          ];

          const menuRadius = r + 40;
          const angleStep = (2 * Math.PI) / menuItems.length;

          // 为每个菜单项创建背景圆和图标
          menuItems.forEach((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * menuRadius;
            const y = Math.sin(angle) * menuRadius;

            const menuGroup = group.addGroup({ name: 'menu-group' });

            // 背景圆，带有阴影和背景色
            menuGroup.addShape('circle', {
              attrs: {
                x,
                y,
                r: 20,
                fill: item.bgColor,
                stroke: '#ccc',
                cursor: 'pointer',
                shadowColor: '#999',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
              name: 'menu-circle',
            });

            // 使用文字作为图标
            menuGroup.addShape('text', {
              attrs: {
                x: x,
                y: y,
                text: item.iconText,
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#333',
                cursor: 'pointer',
              },
              name: 'menu-icon',
            });

            // 文字说明
            menuGroup.addShape('text', {
              attrs: {
                x,
                y: y + 25,
                text: item.label,
                textAlign: 'center',
                textBaseline: 'top',
                fontSize: 12,
                fill: '#333',
              },
              name: 'menu-label',
            });

            // 初始时根据 cfg.showMenu 决定是否显示菜单项
            if (!cfg.showMenu) {
              menuGroup.hide();
            }

            // 点击事件
            menuGroup.on('click', (e) => {
              e.stopPropagation();
              self.handleMenuItemClick(cfg, item.action);
            });
          });

          return mainCircle;
        },
        update(cfg, item) {
          const group = item.getContainer();
          const showMenu = cfg.showMenu;

          const menuGroups = group.findAll(element => element.get('name') === 'menu-group');

          if (showMenu) {
            menuGroups.forEach(menuGroup => {
              menuGroup.show();
            });
          } else {
            menuGroups.forEach(menuGroup => {
              menuGroup.hide();
            });
          }
        },
      });
    },

    handleMenuItemClick(node, action) {
      switch (action) {
        case 'details':
          this.showNodeDetails(node);
          break;
        case 'edit':
          this.editNode(node);
          break;
        case 'delete':
          this.deleteNode(node);
          break;
        case 'displaySubgraph':
          this.displaySubgraph(node);
          break;
        default:
          console.warn('未知菜单操作:', action);
          break;
      }
    },
    showNodeDetails(node) {
      this.selectedNode = node;
      this.drawerVisible = true;
    },
    editNode(node) {
      console.log('编辑节点:', node.id);
      this.$message.info(`正在编辑节点: ${node.id}`);
    },
    deleteNode(node) {
      console.log('删除节点:', node);
      this.$confirm(`确定要删除节点 ${node.id} 吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.graphData.nodes = this.graphData.nodes.filter(n => n.id !== node.id);
        this.graphData.edges = this.graphData.edges.filter(e => e.source !== node.id && e.target !== node.id);
        this.updateGraph();
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    displaySubgraph(node) {
      // 保存原始图数据
      if (!this.originalGraphData) {
        this.originalGraphData = JSON.parse(JSON.stringify(this.graphData));
      }

      const visitedNodes = new Set();
      const visitedEdges = [];

      const nodeQueue = [node.id];
      visitedNodes.add(node.id);

      while (nodeQueue.length > 0) {
        const currentNodeId = nodeQueue.shift();

        // 获取与当前节点连接的边
        const connectedEdges = this.originalGraphData.edges.filter(e => e.source === currentNodeId || e.target === currentNodeId);

        connectedEdges.forEach(edge => {
          const neighborNodeId = edge.source === currentNodeId ? edge.target : edge.source;

          if (!visitedNodes.has(neighborNodeId)) {
            visitedNodes.add(neighborNodeId);
            nodeQueue.push(neighborNodeId);
          }

          visitedEdges.push(edge);
        });
      }

      // 创建新的图数据，只包含访问过的节点和边
      const subgraphNodes = this.originalGraphData.nodes.filter(n => visitedNodes.has(n.id));
      const subgraphEdges = visitedEdges;

      this.graphData = {
        nodes: subgraphNodes,
        edges: subgraphEdges
      };

      this.updateNodeColors();
      this.updateGraph();

      this.$message.success(`已显示节点 ${node.id} 的子图`);
    },
    restoreFullGraph() {
      if (this.originalGraphData) {
        // 创建一个深拷贝，但只拷贝节点和边，而不是整个 graphData 对象
        this.graphData = {
          nodes: this.originalGraphData.nodes.map(node => ({...node})),
          edges: this.originalGraphData.edges.map(edge => ({...edge})),
        };

        // 重新绘制图表
        this.updateNodeColors();
        this.updateGraph();

        this.$message.success('已恢复完整图');
      } else {
        this.$message.warning('没有可恢复的图数据');
      }
    },
    updateNodeColors() {
      if (!this.graphData) return;

      const departmentColors = this.departmentColors;

      const colorMap = {
        default: () => '#DEE9FF',
        department: (node) => {
          const departmentParts = node.department.split(' - ');
          const departmentName = departmentParts.length > 1 ? departmentParts[1] : departmentParts[0];
          const color = departmentColors[departmentName];
          return color || '#CCCCCC';
        },
        role: (node) => this.roleColors[node.role] || '#CCCCCC',
        anomalous: (node) => node.isKnownAnomaly ? '#FF6B6B' : '#4ECDC4'
      };

      this.graphData.nodes.forEach(node => {
        const colorFunc = colorMap[this.colorScheme] || colorMap.default;
        const color = colorFunc(node);

        node.style = {
          fill: color,
          stroke: this.darkenColor(color, 20)
        };
        node.label = node.employeeName; // 显示员工姓名作为标签
      });

      this.updateGraph();
    },
    updateGraph() {
      if (!this.graph || !this.graphData) {
        console.warn('graph或graphData未初始化');
        return;
      }

      this.graph.data(this.graphData);
      this.graph.render();
      // 重新设置布局配置
      this.graph.updateLayout({
        type: 'force',
        preventOverlap: true,
        linkDistance: 200,
        nodeStrength: -30,
      });
    },
    darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
      return "#" + (
          0x1000000 +
          (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 0 ? 0 : B) : 255)
      ).toString(16).slice(1);
    },
    async loadGraphData() {
      try {
        // 使用我们的 API 服务
        const data = await get('/api/anomalous-users/graph-data');
        this.graphData = data;

        // 只保存原始节点和边的快照
        this.originalGraphData = {
          nodes: this.graphData.nodes.map(node => ({...node})),
          edges: this.graphData.edges.map(edge => ({...edge})),
        };

        this.updateNodeColors();
        this.updateGraph();
      } catch (error) {
        console.error('加载图表数据时出错:', error);
        this.$message.warning('从API加载数据失败，将使用模拟数据');

        // 使用模拟数据
        this.graphData = this.mockData;
        this.originalGraphData = {
          nodes: this.mockData.nodes.map(node => ({...node})),
          edges: this.mockData.edges.map(edge => ({...edge})),
        };

        this.updateNodeColors();
        this.updateGraph();
      }
    },
    fitView() {
      if (this.graph) this.graph.fitView();
    },
    resetZoom() {
      if (this.graph) {
        this.graph.zoomTo(1);
        this.graph.moveTo(0, 0);
      }
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    handleResize() {
      if (this.graph && this.$refs.graphContainer) {
        this.graph.changeSize(this.$refs.graphContainer.clientWidth, 600);
      }
    }
  },
  mounted() {
    // 使用nextTick确保DOM元素已经被渲染
    this.$nextTick(() => {
      this.createG6Graph();
      this.loadGraphData();

      window.addEventListener('resize', this.handleResize);
    });
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('resize', this.handleResize);
    if (this.graph) {
      this.graph.destroy();
    }
  }
};
</script>

<style scoped>
.network-graph {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.main-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: #303133;
  margin: 0;
  font-size: 24px;
}

.controls {
  display: flex;
  gap: 10px;
}

.color-scheme-select {
  width: 140px;
}

.graph-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
}

.node-details-drawer :deep(.el-drawer__body) {
  padding: 20px;
}

.node-details {
  box-shadow: none;
}

.close-button {
  padding: 3px;
  font-size: 12px;
}

:deep(.el-descriptions) {
  margin-top: 20px;
}

:deep(.el-descriptions-item__label) {
  font-weight: bold;
}
</style>