window.__VUE_OPTIONS_API__ = true; 
window.__VUE_PROD_DEVTOOLS__ = false; 


import { createApp } from 'vue'; 
import { createRouter, createWebHashHistory } from 'vue-router' 
 
import App from './components/App.vue'; 
import Students from './components/Students.vue'; 
import StudentInfo from './components/StudentInfo.vue'; 
 
 
const routes = [ 
   {path: "/", component: Students}, 
   {path: "/student-info/:id", component: StudentInfo, props:true} 
]; 
 
const router = createRouter({ 
    history: createWebHashHistory(), 
    routes, 
}) 

 
createApp(App).use(router).mount('#app');