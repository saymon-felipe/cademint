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
        component: registerPage,
        meta: {
            title: "Registre-se - Cademint"
        }
    },
    {
        path: '/login:msg?:joined_group?',
        component: login,
        meta: {
            title: "Faça login - Cademint"
        }
    },
    {
        path: "/enter-group:gid?:tk?:email?",
        component: enterGroupInvitation,
        meta: {
            title: "Entrar em um grupo - Cademint",
            metaTags: [
                {
                    name: "description",
                    content: "Entre em um grupo - Cademint"
                },
                {
                    name: "og:description",
                    content: "Entre em um grupo - Cademint"
                }
            ]
        }
    },
    {
        path: '/home:joined_group?',
        component: indexPage,
        meta: {
            title: "Cademint",
            metaTags: [
                {
                    name: "description",
                    content: "Página inicial - Cademint"
                },
                {
                    name: "og:description",
                    content: "Página inicial - Cademint"
                }
            ]
        },
        children: [
            {
                path: '',
                component: kanban
            },
            {
                path: "update-profile",
                component: updateProfile,
                meta: {
                    title: "Meu perfil - Cademint"
                }
            },
            {
                path: 'edit/:id',
                component: editTask,
                meta: {
                    title: "Editar tarefa - Cademint"
                }
            },
            {
                path: 'new/:status',
                component: newTask,
                meta: {
                    title: "Nova tarefa - Cademint",
                    metaTags: [
                        {
                            name: "description",
                            content: "Crie uma tarefa - Cademint"
                        },
                        {
                            name: "og:description",
                            content: "Crie uma tarefa - Cademint"
                        }
                    ]
                }
            }
        ]
    },
    {
        path: "/not-allowed",
        component: notAllowed,
        meta: {
            title: "Acesso negado - Cademint"
        }
    },
    {
        path: "/maintenance",
        component: maintenancePage,
        meta: {
            title: "Em manutenção - Cademint"
        }
    },
    {
        path: '*',
        name: 'error404',
        component: notFound,
        meta: {
            title: "Não encontrado - Cademint"
        }
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;