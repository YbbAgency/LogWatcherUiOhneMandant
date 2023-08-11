import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from "../components/dashboard";
import logwatcherDetail from "../components/logwatcherDetail";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/logWatcher/:id',
    name: 'Log Watcher',
    component: logwatcherDetail
  }
]

const router = new VueRouter({
  routes
})

export default router
