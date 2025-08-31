<template>
    <nav class="header">
        <div class="in-maintenance-element">
            <h4>Cuidado! O sistema entrou em manutenção e as suas alterações não serão salvas!</h4>
        </div>
        <div class="new-version-availabe">
            <h6 class="font-size-5">Nova versão do sistema disponível! Salve o que está fazendo e <span v-on:click="$router.go()">recarregue aqui!</span></h6>
        </div>
        
        <router-link to="/home" v-if="$route.path.indexOf('/home') == -1">
            <i class="fas fa-arrow-circle-left return"></i>
        </router-link>
        <div class="title-container" :title="$root.app_version" v-if="!is_loading">
            <router-link to="/home">
                <div class="header-images" v-on:click="goToHome()">
                    <img src="../assets/img/cademint-icon-blue.png" />
                    <img src="../assets/img/logo-cademint-v2-reduced.png" />
                </div>
            </router-link>
        </div>
        <div v-else>&nbsp;</div>
        <changeProjectDropdown v-if="showProjectDropdown" :gid="gid" />
        <div class="menu-wrapper" v-on:click="showResponsiveMenu = false; showMenu = false;"></div>
        <div class="go-to-user-profile">
            <div class="responsive-menu" v-on:click="showResponsiveMenu = !showResponsiveMenu">
                <img class="avatar-p avatar-header" :src="$root.user.profile_photo">
                <span class="material-icons profile-more-options">expand_more</span>
                <div class="responsive-menu-container">
                    <div class="responsive-profile-more-options-container">
                        <div class="responsive-user">
                            <h3><span class="user-name">{{ $root.user.nome }}</span></h3>
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
                <div class="avatar-p avatar-header background-image" :style="`background-image: url('${$root.user.profile_photo}')`"></div>
                <h3>Olá, <span class="user-name">{{ $root.user.nome }}</span></h3>
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
    </nav>
</template>

<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import changeProjectDropdown from "./changeProjectDropdown.vue";

export default {
    name: "headerComponent",
    mixins: [globalMethods],
    data() {
        return {
            project_value: null,
            project_name: "",
            show_modal: false,
            is_loading: true,
            showMenu: false,
            showResponsiveMenu: false,
            gid: null,
            gname: "",
            showProjectDropdown: true
        }
    },
    methods: {
        goToHome: function () {
            if (this.$router.currentRoute.path == "/home") {
                return;
            }

            this.$router.push("/home");
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
        }
    },
    watch: {
        $route(obj) {
            if (obj.path != "/home") {
                this.showProjectDropdown = false;
            } else {
                this.showProjectDropdown = true;
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
            this.is_loading = false;
        }, 200)

        if (window.location.href.indexOf("/home") != -1) {
            let url = new URLSearchParams(window.location.search);

            this.gid = url.get("gid");
            this.gname = url.get("gname");
        }
        
        if (window.location.pathname == "/home") {
            this.showProjectDropdown = true;
        } else {
            this.showProjectDropdown = false;
        }
    },
    components: {
        changeProjectDropdown
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
        justify-content: space-between;
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

    .title-container a {
        display: flex;
        flex-direction: column;
        text-align: center;
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

    .header {
        padding: 0.5rem;
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
}
</style>