<template>
    <nav class="header" v-if="!is_loading">
        <div class="in-maintenance-element">
            <h4>Cuidado! O sistema entrou em manutenção e as suas alterações não serão salvas!</h4>
        </div>
        <div class="new-version-availabe">
            <h6 class="font-size-5">Nova versão do sistema disponível! Salve o que está fazendo e <span v-on:click="$router.go()">recarregue aqui!</span></h6>
        </div>
        <newGroupModal v-if="showNewGroup" :showNewGroup="showNewGroup" :user="user" @showNewGroup="showNewGroup = false" /> 
        <router-link to="/home" v-if="$route.path.indexOf('/home') == -1">
            <i class="fas fa-arrow-circle-left return"></i>
        </router-link>
        <div class="title-container">
            <router-link to="/home">
                <div class="header-images" v-on:click="goToHome()">
                    <img src="../assets/img/cademint-icon-blue.png" />
                    <img src="../assets/img/logo-cademint-v2-reduced.png" />
                </div>
            </router-link>
        </div>
        <div class="current-project-container" v-if="$route.path.indexOf('/home') != -1 && $route.path.indexOf('/edit') == -1 && $route.path.indexOf('/update-profile') == -1">
            <div class="projects">
                <select id="projects-name" v-model="project_value" @change="changeProject()">
                    <option v-for="(project, index) in user.user_groups" :key="index" :value="project.groups_id">{{ project.group_name }}</option>
                </select>
                <span class="material-icons" id="change-project" v-on:click="openResponsiveChangeProject">sync</span>
                <span class="material-icons" id="new-project" v-on:click="showNewGroup = true" @showModal="showModal = false">add</span>
            </div>
        </div>
        <div class="menu-wrapper" v-on:click="showResponsiveMenu = false; showMenu = false;"></div>
        <div class="go-to-user-profile">
            <div class="responsive-menu" v-on:click="showResponsiveMenu = !showResponsiveMenu">
                <img class="avatar-p avatar-header" :src="user.profile_photo">
                <span class="material-icons profile-more-options">expand_more</span>
                <div class="responsive-menu-container">
                    <div class="responsive-profile-more-options-container">
                        <div class="responsive-user">
                            <h3><span class="user-name">{{ user.nome }}</span></h3>
                        </div>
                        <ul>
                            <li v-if="$route.path != '/home'"><router-link to="/home">Início</router-link></li>
                            <li><router-link to="/help">Ajuda</router-link></li>
                            <li v-if="$route.path != '/home/update-profile'"><router-link to="/home/update-profile">Alterar perfil</router-link></li>
                            <li v-on:click="logoutUser()">Sair</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="go-to-user-profile-inner" v-on:click="showMenu = !showMenu">
                <img class="avatar-p avatar-header" :src="user.profile_photo">
                <h3>Olá, <span class="user-name">{{ user.nome }}</span></h3>
                <span class="material-icons profile-more-options">expand_more</span>
                <div class="profile-more-options-container">
                    <ul>
                        <li v-if="$route.path != '/home'"><router-link to="/home">Início</router-link></li>
                        <li><router-link to="/help">Ajuda</router-link></li>
                        <li v-if="$route.path != '/home/update-profile'"><router-link to="/home/update-profile">Alterar perfil</router-link></li>
                        <li v-on:click="logoutUser()">Sair</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="responsive-choose-project-modal">
            <div class="responsive-projects-list">
                <span v-for="(group, index) in user.user_groups" :key="index" :id="'project-' + group.groups_id" class="responsive-project" v-on:click="changeProject(false, group.groups_id, group.group_name, true)">{{ group.group_name }}</span>
            </div>
        </div>
        <div class="overlay" v-on:click="closeResponsiveChangeProject"></div>
    </nav>
</template>

<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import newGroupModal from './newGroupModal.vue';

export default {
    name: "headerComponent",
    mixins: [globalMethods],
    data() {
        return {
            user: "",
            project_value: null,
            project_name: "",
            show_modal: false,
            is_loading: true,
            showNewGroup: false,
            app_version: this.loadSystemVersion(),
            older_app_version: this.app_version,
            showMenu: false,
            showResponsiveMenu: false
        }
    },
    methods: {
        goToHome: function () {
            let location = window.location.pathname;
            if (location == "/home") {
                this.$router.go();
                return;
            }
            window.location.pathname = "/home";
        },
        openResponsiveChangeProject: function () {
            let modal = $(".responsive-choose-project-modal"), overlay = $(".overlay");

            overlay.show();
            modal.show();
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        closeResponsiveChangeProject: function () {
            let modal = $(".responsive-choose-project-modal"), overlay = $(".overlay");

            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                overlay.hide();
                modal.hide();
            }, 400);
        },
        closeMenu: function () {
            $(".profile-more-options").toggleClass("rotate");
            $(".profile-more-options-container").toggleClass("opacity-1");
            setTimeout(() => {
                $(".profile-more-options-container").hide();
                $(".menu-wrapper").hide();
            }, 400);
        },
        openMenu: function () {
            $(".profile-more-options-container").show();
            setTimeout(() => {
                $(".profile-more-options").toggleClass("rotate");
                $(".profile-more-options-container").toggleClass("opacity-1");
                $(".menu-wrapper").show();
            }, 10);
        },
        closeResponsiveMenu: function () {
            $(".profile-more-options").toggleClass("rotate");
            $(".responsive-profile-more-options-container").css("opacity", 0);
            setTimeout(() => {
                $(".responsive-profile-more-options-container").hide();
                $(".menu-wrapper").hide();
            }, 400);
        },
        openResponsiveMenu: function () {
            $(".responsive-profile-more-options-container").show();
            setTimeout(() => {
                $(".profile-more-options").toggleClass("rotate");
                $(".responsive-profile-more-options-container").css("opacity", 1);
                $(".menu-wrapper").show();
            }, 10);
        },
        changeProject: function (programatic = false, projectId = null, project_name = null, responsive = false) { // No onchange do select procura o grupo pelo nome no input e armazena em session storage.
            if (programatic) {
                this.setCurrentProjectInSessionStorage(projectId, project_name);
            }

            if ($("#projects-name").val() != null) {
                this.setCurrentProjectInSessionStorage($("#projects-name").val(), $("#projects-name option:selected").html());
            }
            
            if (responsive) {
                this.setCurrentProjectInSessionStorage(projectId, project_name);
                $(".responsive-project").removeClass("active");
                $("#project-" + projectId).addClass("active");
                this.closeResponsiveChangeProject();
            }
        },
        checkIfProjectChanged: function () {
            setInterval(() => {
                let project = this.getCurrentProjectInSessionStorage();
                let jwt = this.getJwtFromLocalStorage();
                if (jwt == "" || jwt == undefined || jwt == null) {
                    clearInterval();
                    return;
                }
                if (this.project_value != project.group_id) {
                    this.project_name = project.group_name;
                    this.project_value = project.group_id;
                    this.requireUser();
                }
            }, 1000);
        },
        findProjectOption: function () {
            let project = this.getCurrentProjectInSessionStorage();
            if (project == null || project == 'undefined') {
                this.project_value = this.user.user_groups[0].groups_id;
                this.project_name = this.user.user_groups[0].group_name;
                this.setCurrentProjectInSessionStorage(this.project_value, this.project_name);
                setTimeout(() => {
                    this.changeProject();
                }, 10);
            } else {
                this.project_value = project.group_id;
                this.changeProject(true, project.group_id, project.group_name);
            }
        },
        findResponsiveProject: function () {
            let project = this.getCurrentProjectInSessionStorage();
            setTimeout(() => {
                $("#project-" + project.group_id).addClass("active");
            }, 200);
        }
    },
    watch: {
        user: function () {
            this.findProjectOption();
            this.findResponsiveProject();
            this.is_loading = false;
        },
        app_version: function () {
            if (this.app_version != this.older_app_version) {
                $(".in-maintenance-element").hide();
                $(".new-version-availabe").show();
            }
        },
        showMenu: function () {
            if (this.showMenu) {
                this.openMenu();
                return;
            }
            this.closeMenu();
        },
        showResponsiveMenu: function () {
            if (this.showResponsiveMenu) {
                this.openResponsiveMenu();
                return;
            }
            this.closeResponsiveMenu();
        }
    },
    mounted() {
        setTimeout(() => {
            if (window.location.href.indexOf("/home") != -1) {
                this.requireUser();
                this.checkIfProjectChanged();
            }
        }, 200);
    },
    components: {
        newGroupModal
    }
}
</script>

<style scoped>
    .menu-wrapper {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: none;
        z-index: 3;
    }

    .active {
        background: var(--gray) !important;
    }

    .overlay {
        opacity: 0.4;
    }

    .responsive-choose-project-modal {
        display: none;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 90vw;
        max-width: 800px;
        max-height: 600px;
        height: 70vh;
        background: var(--white);
        border-radius: 1rem;
        z-index: 9999;
        transition: all 0.4s;
        transform: translateY(-100px);
        padding: 1rem;
        overflow: hidden;
    }

    .responsive-projects-list {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
    }

        .responsive-projects-list span {
            cursor: pointer;
            background: var(--gray-high);
            padding: .5rem 1.7rem;
            display: flex;
            justify-content: center;
            width: 90%;
            border-radius: 10px;
            text-transform: uppercase;
            font-weight: 600;
            margin: .3rem 0;
        }

            .responsive-projects-list span.active {
                color: var(--white);
            }

            .responsive-projects-list span:hover {
                background: var(--gray-high);
            }

    @media (max-width: 388px) {
        .responsive-projects-list span {
            font-size: .9rem;
        }
    }  

    .in-maintenance-element {
        display: none;
        width: 100vw;
        background: var(--red);
        color: white;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 6;
        transition: background 0.4s;
        text-align: center;
        animation-name: blinkRed;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }

        .in-maintenance-element h4 {
            margin: .3rem 0;
            font-size: 1rem;
        }

    @keyframes blinkRed {
        0% {
            background: var(--red-low);
        }
        50% {
            background: var(--red);
        }
        100% {
            background:  var(--red-low);
        }
    }

    .new-version-availabe {
        display: none;
        width: 100%;
        background:rgb(0, 162, 232);
        color: white;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 6;
        transition: background 0.4s;
        text-align: center;
        animation-name: blink;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }

        .new-version-availabe h6 {
            margin: .3rem 0;
        }

        .new-version-availabe span {
            text-decoration: underline;
            cursor: pointer;
        }

    @keyframes blink {
        0% {
            background:rgb(0, 162, 232);
        }
        50% {
            background:rgb(59, 192, 248);
        }
        100% {
            background:rgb(0, 162, 232);
        }
    }

    .return {
        color: var(--blue);
        margin-left: 1rem;
    }

    .material-icons {
        font-size: 2rem;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: end;
        position: fixed;
        top: 0;
        left: 0;
        background: var(--yellow);
        width: 100vw;
        padding: .5rem 1.5rem;
        z-index: 99999;
    }

    .header-images {
        display: flex;
        align-items: center;
    }

        .header-images img:nth-child(1) {
            width: 35px;
            height: 35px;
            margin-right: 1rem;
        }

        .header-images img:nth-child(2) {
            width: 160px;
            height: 17px;
        }

    .title-container {
        width: 100%;
    }

    .title-container a {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 12rem;
    }

    .page-title {
        color: var(--blue)!important;
        margin: 0 1rem!important;
        font-weight: 500;
        font-size: 1.75rem;
        text-decoration: none;
    }

    .app-version {
        margin: auto;
    }

    .current-project-container {
        min-width: 11.3rem;
        margin: auto 1.5rem;
        background: var(--blue);
        padding: 5px;
        border-radius: 5px;
        color: white;
        height: 2.5rem;
        position: relative;
    }

        .current-project-container select {
            width: 105%;
            list-style: none;
            border: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            outline: none;
            cursor: pointer;
            background: var(--blue);
            position: absolute;
            font-size: 16px;
            left: -9px;
            margin: auto .3rem;
            padding: 7px;
            border-radius: 5px;
            color: white;
            padding: 5px 2rem 5px 1rem;
            transition: opacity 0.4s;
        }

            .current-project-container select option {
                cursor: pointer;
                border-radius: 5px;
                padding: 5px;
                overflow: hidden;
            }

                .current-project-container select option:checked {
                    color: white;
                    background: var(--blue-low);
                }

        .current-project-container #new-project {
            color: var(--white) !important;
            font-size: 1.5rem !important;
            background: var(--blue);
            cursor: pointer;
            position: absolute;
            right: 0;
            margin: 0 .3rem;
        }

.projects {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
}

#change-project {
    cursor: pointer;
    margin: 0 5rem 0 .4rem;
    font-size: 1rem;
    color: var(--white) !important;
    transition: transform 0.4s;
    display: none;
}

 #new-project {
    color: white!important;
    font-size: .9rem!important;
    background: var(--blue);
    cursor: pointer;
    position: absolute;
    right: 0;
    margin: 0 .3rem;
}

.go-to-user-profile {
    padding-left: 1.5rem;
    border-left: 1px solid var(--yellow-low);
    cursor: pointer;
    z-index: 4;
}

.responsive-menu {
    display: none;
}

.responsive-profile-more-options-container {
    position: absolute;
    top: 105%;
    right: 12px;
    min-width: 10rem;
    background: #FFCA37;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index: 4;
    transition: all 0.4s;
    opacity: 0;
    text-align: center;
    width: 8rem;
    display: none;
}

.responsive-profile-more-options-container ul {
    margin: 0;
    list-style: none;
}

    .responsive-profile-more-options-container ul li {
        font-weight: 500;
        cursor: pointer;
        margin: 3px 0;
        padding: 4px 10px;
        border-bottom: 1px solid var(--yellow-low);
        padding-bottom: 6px;
        width: 80%;
        margin: auto;
    }

        .responsive-profile-more-options-container ul li:first-child {
            border-top: none;
        }

        .responsive-profile-more-options-container ul li:last-child {
            border-bottom: none;
        }

        .responsive-profile-more-options-container ul li:hover {
            background: #dfb030;
        }

.responsive-user {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--yellow-low);
    padding-bottom: 6px;
    width: 80%;
    margin: auto;
}

    .responsive-user h3 {
        margin: 0;
        font-weight: 500;
    }

.responsive-menu #menu-hamburguer {
    font-size: 2.2rem;
}

.avatar-header {
    margin-right: 1rem;
}

.user-name {
    margin-left: .2rem;
}

.profile-more-options {
    font-size: 2rem;
    color: black!important;
    cursor: pointer;
    transition: all 0.4s;
}

.go-to-user-profile-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

    .go-to-user-profile-inner h3 {
        margin-top: .2rem;
        display: flex;
        margin-right: .5rem;
        font-weight: 500;
        font-size: 1.1rem;
    }

.profile-more-options-container {
    position: absolute;
    top: 105%;
    right: 12px;
    background: #FFCA37;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index: 4;
    transition: all 0.4s;
    overflow: hidden;
    opacity: 0;
    display: none;
    /*display: block;*/
}

    .profile-more-options-container ul {
        margin: 0;
        list-style: none;
    }

        .profile-more-options-container ul li {
            font-weight: 500;
            cursor: pointer;
            margin: 3px 0;
            padding: 4px 10px;
        }

            .profile-more-options-container ul li:hover {
                background: #dfb030;
            }

@media (max-width: 700px) {
    .title-container a {
        width: 100%;
    }

    .responsive-menu {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

        .responsive-menu #menu-hamburguer {
            color: black!important;
            cursor: pointer;
            background: transparent;
            padding: .5rem .7rem;
        }

    .avatar-header {
        margin-right: .5rem;
    }

    .go-to-user-profile-inner {
        display: none;
    }
}

@media (max-width: 576px) {
    .header-images img:nth-child(2) {
        display: none;
    }
}

@media (max-width: 490px) {
        .current-project-container #new-project, .current-project-container #change-project {
            font-size: 1.4rem !important;
        }

            .responsive-menu #menu-hamburguer {
                font-size: 1.7rem;
            }

        .current-project-container #new-project {
            padding: .5rem;
            right: -7px;
        }

        .current-project-container #change-project {
            display: block;
        }

    #change-project {
        display: block;
    }

    #new-project {
        padding: .5rem;
        right: -7px;
    }
} 

@media (max-width: 417px) {
    .go-to-user-profile {
        padding-left: 1.2rem;
    }

    .current-project-container {
        margin: auto 1rem;
        min-width: 5rem;
    }

        .current-project-container select {
            padding: .3rem .3rem .3rem .7rem;
            display: none;
            opacity: 0;
            width: 585%!important;
            position: absolute;
            left: -483%;
            margin-top: 2.4rem;
            min-height: 2.5rem;
        }
}  

@media (max-width: 363px) {
    .page-title {
        font-size: 1.4rem;
    }

    .header {
        padding: 0.5rem;
    }
}
</style>