import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import login from '../pages/loginPage.vue';
import indexPage from '../pages/indexPage.vue';
import kanban from "../components/kanban.vue";
import editTask from '../components/editTask.vue';
import newTask from '../components/newTask.vue';
import notAllowed from '../pages/notAllowedPage.vue';
import notFound from '../pages/notFoundPage.vue';
import enterGroupInvitation from '../components/enterGroupInvitation.vue';
import registerPage from "../pages/registerPage.vue";
import updateProfile from '../components/updateProfile.vue';
import maintenancePage from '../pages/maintenancePage.vue';

const routes = [
    {
        path: "/register:joined_group?:email?:gid?:tk?:beta_hash?",
        component: registerPage
    },
    {
        path: '/login:msg?:joined_group?',
        component: login
    },
    {
        path: "/enter-group:gid?:tk?:email?",
        component: enterGroupInvitation
    },
    {
        path: '/home:joined_group?',
        component: indexPage,
        children: [
            {
                path: '',
                component: kanban
            },
            {
                path: "update-profile",
                component: updateProfile
            },
            {
                path: 'edit/:id',
                component: editTask
            },
            {
                path: 'new/:status',
                component: newTask
            }
        ]
    },
    {
        path: "/not-allowed",
        component: notAllowed
    },
    {
        path: "/maintenance",
        component: maintenancePage
    },
    {
        path: '*',
        name: 'error404',
        component: notFound
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;