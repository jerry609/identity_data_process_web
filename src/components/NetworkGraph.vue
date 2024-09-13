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
import G6 from '@antv/g6';
import axios from 'axios';

export default {
  name: 'NetworkGraph',
  data() {
    return {
      graph: null,
      graphData: null,
      colorScheme: 'default',
      colorSchemeOptions: [
        { value: 'default', label: '默认' },
        { value: 'department', label: '部门' },
        { value: 'role', label: '角色' },
        { value: 'anomalous', label: '异常状态' }
      ],
      selectedNode: null,
      drawerVisible: false,
      maxAnomalyScore: 0,
      minNodeSize: 20,
      maxNodeSize: 50,
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
    };
  },
  methods: {
    createG6Graph() {
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
          default: ['drag-canvas', 'zoom-canvas', {
            type: 'drag-node',
            enableOptimize: true,  // Enable drag optimization
          }, 'activate-relations']
        },
        layout: {
          type: 'forceAtlas2',
          preventOverlap: true,
          kr: 10,
          gravity: 1
        },
        defaultNode: {
          type: 'circle-with-menu',
          size: this.minNodeSize,
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
            lineWidth: 2,
          },
          labelCfg: {
            style: {
              fill: '#333',
              fontSize: 12
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
        this.selectedNodeId = model.id;
        this.graph.updateItem(node, {
          showMenu: true,
        });
        this.graph.paint();
      });

      this.graph.on('canvas:click', () => {
        if (this.selectedNodeId) {
          const node = this.graph.findById(this.selectedNodeId);
          this.graph.updateItem(node, {
            showMenu: false,
          });
          this.selectedNodeId = null;
          this.graph.paint();
        }
        this.drawerVisible = false;
      });
    },
    registerCustomNode() {
      G6.registerNode('circle-with-menu', {
        draw: (cfg, group) => {
          const { size, style, labelCfg } = cfg;
          const mainCircle = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: size / 2,
              ...style,
            },
          });

          if (cfg.label) {
            group.addShape('text', {
              attrs: {
                text: cfg.label,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                ...labelCfg.style,
              },
            });
          }

          if (cfg.showMenu) {
            const menuItems = [
              { text: '详情', action: 'details' },
              { text: '编辑', action: 'edit' },
              { text: '删除', action: 'delete' },
            ];
            const menuRadius = size / 2 + 20;
            const itemAngle = (2 * Math.PI) / menuItems.length;

            menuItems.forEach((item, index) => {
              const angle = index * itemAngle - Math.PI / 2;
              const x = Math.cos(angle) * menuRadius;
              const y = Math.sin(angle) * menuRadius;

              const menuItemGroup = group.addGroup();
              menuItemGroup.addShape('circle', {
                attrs: {
                  x,
                  y,
                  r: 15,
                  fill: '#fff',
                  stroke: '#1890ff',
                  cursor: 'pointer',
                },
              });

              menuItemGroup.addShape('text', {
                attrs: {
                  x,
                  y,
                  text: item.text,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: '#1890ff',
                  fontSize: 12,
                  cursor: 'pointer',
                },
              });

              menuItemGroup.on('click', (e) => {
                e.stopPropagation();
                this.handleMenuItemClick(cfg, item.action);
              });
            });
          }

          return mainCircle;
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
    updateNodeColors() {
      if (!this.graphData) return;

      const departmentColors = this.departmentColors;

      const colorMap = {
        default: () => '#DEE9FF',
        department: (node) => {
          const departmentName = node.department.split(' - ')[1];
          const color = departmentColors[departmentName];
          console.log(`Node ${node.id}, Department: ${departmentName}, Color: ${color}`);
          return color || '#CCCCCC';
        },
        role: (node) => this.roleColors[node.role] || '#CCCCCC',
        anomalous: (node) => node.isKnownAnomaly ? '#FF6B6B' : '#4ECDC4'
      };

      this.graphData.nodes.forEach(node => {
        const colorFunc = colorMap[this.colorScheme] || colorMap.default;
        const color = colorFunc(node);

        // console.log(`Applying color ${color} to node ${node.id}`);

        node.style = {
          fill: color,
          stroke: this.darkenColor(color, 20)
        };
        node.label = node.id;
      });

      this.updateGraph();
    },
    updateGraph() {
      this.graph.data(this.graphData);
      this.graph.render();
    },
    darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    },
    async loadGraphData() {
      try {
        const response = await axios.get('/api/graph-data');
        this.graphData = response.data;

        this.graph.updateLayout({
          type: 'forceAtlas2',
          preventOverlap: true,
          kr: 10,
          gravity: 1
        });

        this.updateNodeColors();
      } catch (error) {
        console.error('加载图表数据时出错:', error);
        this.$message.error('加载图表数据失败');
      }
    },
    fitView() {
      this.graph.fitView();
    },
    resetZoom() {
      this.graph.zoomTo(1);
      this.graph.moveTo(0, 0);
    },
    closeDrawer() {
      this.drawerVisible = false;
    }
  },
  watch: {
    colorScheme: {
      handler() {
        console.log('Color scheme changed to:', this.colorScheme);
        this.updateNodeColors();
      },
      immediate: true
    }
  },
  mounted() {
    this.createG6Graph();
    this.loadGraphData();
    this.$nextTick(() => {
      this.updateNodeColors();
    });
    window.addEventListener('resize', () => {
      if (this.graph) {
        this.graph.changeSize(this.$refs.graphContainer.clientWidth, 600);
      }
    });
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
