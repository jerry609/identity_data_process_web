import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 引入 vue-echarts 和 echarts
import ECharts from 'vue-echarts/components/ECharts.vue';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

// 注册 ECharts 组件
Vue.component('v-chart', ECharts);

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
