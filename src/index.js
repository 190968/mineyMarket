import * as Vue from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import axios from 'axios';
import VueAxios from 'vue-axios';
import './main.css';
import { createWebHistory, createRouter } from "vue-router";
import Home from './Home.vue';
import Websocket from './Websocket.vue';
import NotFound from './NotFound.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/websocket', component: Websocket },
    {path: "/:catchAll(.*)", component: NotFound},
  ]
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
const app = Vue.createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(VueAxios, axios)
app.use(router)
app.mount("#root");