<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <h1 class="dashboard__title">异常用户发现</h1>
        <el-select v-model="selectedDepartment" placeholder="选择部门" class="dashboard__filter" @change="fetchData">
          <el-option label="所有部门" value=""></el-option>
          <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept"></el-option>
        </el-select>
      </el-header>

      <el-main>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <el-card class="metric-card">
              <div slot="header">异常用户数</div>
              <div class="metric-value">{{ anomalousUsers.length }}</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card class="metric-card">
              <div slot="header">平均异常分数</div>
              <div class="metric-value">{{ averageAnomalyScore.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card class="metric-card">
              <div slot="header">最高异常分数</div>
              <div class="metric-value">{{ highestAnomalyScore.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card class="metric-card">
              <div slot="header">非工作时间活动用户</div>
              <div class="metric-value">{{ nonWorkingHourUsers }}</div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-card class="chart-card">
              <div slot="header">异常分数分布</div>
              <v-chart :options="anomalyScoreChartOption"/>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-card class="chart-card">
              <div slot="header">活动散点图</div>
              <v-chart :options="activityScatterChartOption"/>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-card class="chart-card">
              <div slot="header">部门分布</div>
              <v-chart :options="departmentPieChartOption"/>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-card class="chart-card">
              <div slot="header">非工作时间活动比率</div>
              <v-chart :options="nonWorkingHourActivityChartOption"/>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="chart-card">
              <div slot="header">用户行为趋势分析</div>
              <v-chart :options="userBehaviorTrendOption"/>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="chart-card">
              <div slot="header">用户多维分析</div>
              <v-chart :options="userRadarChartOption"/>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="table-card">
              <div slot="header">
                <span>前 10 个异常用户</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="exportToCSV">导出 CSV</el-button>
              </div>
              <el-table :data="allAnomalousUsers" style="width: 100%" :max-height="400">
                <el-table-column prop="userId" label="用户 ID" sortable></el-table-column>
                <el-table-column prop="anomalyScore" label="异常分数" sortable>
                  <template slot-scope="scope">
                    {{ scope.row.anomalyScore.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column prop="role" label="角色" sortable></el-table-column>
                <el-table-column prop="department" label="部门" sortable></el-table-column>
                <el-table-column prop="nonWorkingHourActivityRatio" label="非工作时间活动比率" sortable>
                  <template slot-scope="scope">
                    {{ (scope.row.nonWorkingHourActivityRatio * 100).toFixed(2) }}%
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
// import {saveAs} from 'file-saver';

export default {
  name: 'AnomalousUserDashboard',
  data() {
    return {
      anomalousUsers: [],
      selectedDepartment: '',
      departments: [],
    };
  },
  computed: {
    filteredData() {
      return this.selectedDepartment
          ? this.anomalousUsers.filter(user => user.department === this.selectedDepartment)
          : this.anomalousUsers;
    },
    // topAnomalousUsers() {
    //   return [...this.filteredData]
    //       .sort((a, b) => b.anomalyScore - a.anomalyScore)
    //       .slice(0, 10);
    // },
    allAnomalousUsers() {
      return [...this.filteredData]
          .sort((a, b) => b.anomalyScore - a.anomalyScore);
    },

    anomalyScoreChartOption() {
      return {
        xAxis: {
          type: 'category',
          data: this.filteredData.map(user => user.userId),
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: this.filteredData.map(user => user.anomalyScore),
          type: 'bar'
        }],
        tooltip: {
          trigger: 'axis',
        },
      };
    },
    activityScatterChartOption() {
      return {
        xAxis: {
          type: 'value',
          name: '邮件数量',
        },
        yAxis: {
          type: 'value',
          name: 'HTTP 请求数量',
        },
        series: [{
          data: this.filteredData.map(user => [user.emailCount, user.httpCount]),
          type: 'scatter'
        }],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `邮件数量: ${params.value[0]}<br>HTTP 请求数量: ${params.value[1]}`;
          }
        },
      };
    },
    departmentPieChartOption() {
      const departmentCounts = this.filteredData.reduce((acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.entries(departmentCounts).map(([name, value]) => ({name, value}));

      return {
        series: [{
          type: 'pie',
          radius: '50%',
          data: pieData,
          label: {
            formatter: '{b}: {d}%'
          },
        }],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
      };
    },
    userBehaviorTrendOption() {
      const sortedData = [...this.filteredData].sort((a, b) => b.httpCount - a.httpCount);
      return {
        xAxis: {
          type: 'category',
          data: sortedData.map(user => user.userId),
        },
        yAxis: {
          type: 'value',
          name: '活动数量',
        },
        series: [
          {
            name: '邮件数量',
            data: sortedData.map(user => user.emailCount),
            type: 'line',
            smooth: true,
          },
          {
            name: 'HTTP 请求数量',
            data: sortedData.map(user => user.httpCount),
            type: 'line',
            smooth: true,
          }
        ],
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['邮件数量', 'HTTP 请求数量'],
        },
      };
    },
    userRadarChartOption() {
      const radarData = this.filteredData.map(user => ({
        value: [user.emailCount, user.httpCount, user.fileCount, user.pcCount, user.timeSeriesAnomaliesCount],
        name: user.userId
      }));

      return {
        radar: {
          indicator: [
            {name: '邮件数量', max: Math.max(...this.filteredData.map(user => user.emailCount))},
            {name: 'HTTP 请求数量', max: Math.max(...this.filteredData.map(user => user.httpCount))},
            {name: '文件数量', max: Math.max(...this.filteredData.map(user => user.fileCount))},
            {name: 'PC 数量', max: Math.max(...this.filteredData.map(user => user.pcCount))},
            {name: '时间序列异常', max: Math.max(...this.filteredData.map(user => user.timeSeriesAnomaliesCount))},
          ],
        },
        series: [{
          name: '用户多维分析',
          type: 'radar',
          data: radarData,
        }],
        tooltip: {
          trigger: 'item',
        },
      };
    },
    nonWorkingHourActivityChartOption() {
      return {
        xAxis: {
          type: 'category',
          data: this.filteredData.map(user => user.userId),
        },
        yAxis: {
          type: 'value',
          name: '非工作时间活动比率',
        },
        series: [{
          data: this.filteredData.map(user => user.nonWorkingHourActivityRatio),
          type: 'bar'
        }],
        tooltip: {
          trigger: 'axis',
        },
      };
    },
    averageAnomalyScore() {
      return this.filteredData.reduce((sum, user) => sum + user.anomalyScore, 0) / this.filteredData.length;
    },
    highestAnomalyScore() {
      return Math.max(...this.filteredData.map(user => user.anomalyScore));
    },
    nonWorkingHourUsers() {
      return this.filteredData.filter(user => user.nonWorkingHourActivityRatio > 0.2).length;
    },
  },
  methods: {
    async fetchData() {
      try {
        let url = '/api/anomalous-users';
        if (this.selectedDepartment) {
          url += `/by-department?department=${encodeURIComponent(this.selectedDepartment)}`;
        }
        const response = await axios.get(url);
        this.anomalousUsers = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async fetchDepartments() {
      try {
        const response = await axios.get('/api/anomalous-users/departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    exportToCSV() {
      const csvContent = [
        ['用户 ID', '异常分数', '角色', '部门', '非工作时间活动比率'],
        ...this.allAnomalousUsers.map(user => [
          user.userId,
          user.anomalyScore.toFixed(2),
          user.role,
          user.department,
          (user.nonWorkingHourActivityRatio * 100).toFixed(2) + '%'
        ])
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "top_anomalous_users.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  },
  created() {
    this.fetchData();
    this.fetchDepartments();
  },
};
</script>

<style scoped>
.dashboard {
  font-family: 'Arial', sans-serif;
}

.el-header {
  background-color: #f0f2f5;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.dashboard__title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.dashboard__filter {
  width: 200px;
}

.el-main {
  background-color: #ffffff;
  padding: 20px;
}

.metric-card {
  text-align: center;
  margin-bottom: 20px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.chart-card, .table-card {
  margin-bottom: 20px;
}

.chart-card >>> .el-card__header,
.table-card >>> .el-card__header {
  font-weight: bold;
  background-color: #f0f2f5;
}

.chart-card >>> .echarts {
  height: 300px;
}

.el-table {
  margin-top: 20px;
}
</style>