import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../components/layout/Dashboard.vue';
import UserActivity from '../components/UserActivity.vue';
import LogInfo from '../components/LogModule/LogInfo.vue';
import CustomGraph from '../components/Graph/CustomGraph.vue';
import demo from '../components/demo.vue';
import FileList from '../components/FileList.vue';
import Clean from '../components/Prepro/Clean.vue';
import DataSearch from '../components/Prepro/DataSearch.vue'; // Make sure to import DataSearch
import FillData from '../components/Prepro/FillData.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      { path: 'user-activity', name: 'UserActivity', component: UserActivity },
      { path: 'log-info', name: 'LogInfo', component: LogInfo },
      { path: 'submodule1', name: 'CustomGraph', component: CustomGraph },
      { path: 'demo', name: 'demo', component: demo },
      { path: 'FileList', name: 'FileList', component: FileList },
      { path: 'Clean', name: 'Clean', component: Clean },
      { path: 'DataSearch', name: 'DataSearch', component: DataSearch },
      { path: 'FillData', name: 'FillData', component: FillData } // Correct the component reference here
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

// Extend push and replace methods to handle NavigationDuplicated error
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

export default router;
