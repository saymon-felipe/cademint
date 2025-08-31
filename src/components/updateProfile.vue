<template>
    <section class="update-profile-container" v-if="!loading">
        <div class="page-content">
            <div class="user-banner" :style="'background-image: url(' + $root.user.user_cover_image + '); background-position-y: center;'">
                <div class="change-banner" v-on:click="toggleBannerDetails()">
                    <span class="material-icons">edit</span>
                    <span>Capa</span>
                </div>
                <div class="banner-details" v-if="showBannerDetails">
                    <ul>
                        <li v-if="$root.user.user_cover_image != default_user_cover_image" v-on:click="showBanner">Ver foto</li>
                        <li v-on:click="removeBanner()" v-if="$root.user.user_cover_image != default_user_cover_image">Excluir foto</li>
                        <li v-on:click="showSendPhoto(true)">Enviar foto</li>
                    </ul>
                </div>
            </div>
            <div class="informations-container">
                <div class="user-image">
                    <div class="user-image-container">
                        <div class="profile-avatar background-image" :style="`background-image: url('${$root.user.profile_photo}')`"></div>
                        <div class="user-level-badge">Nível {{$root.user.user_level}}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="170px" height="170px">
                            <defs>
                                <linearGradient id="GradientColor">
                                    <stop offset="0%" stop-color="#5d7bfd" />
                                    <stop offset="100%" stop-color="#355afd" />
                                </linearGradient>
                            </defs>
                            <circle id="circle-progress" cx="85" cy="85" r="79" stroke-linecap="round" />
                        </svg>
                        <div class="change-photo" v-on:click="togglePhotoDetails()" :style="showPhotoDetails ? 'background: var(--gray-high)' : ''">
                            <span class="material-icons">photo_camera</span>
                            <div class="photo-details" v-if="showPhotoDetails">
                                <ul>
                                    <li v-if="$root.user.profile_photo != default_user_image" v-on:click="showPhoto">Ver foto</li>
                                    <li v-on:click="removePhoto()" v-if="$root.user.profile_photo != default_user_image">Excluir foto</li>
                                    <li v-on:click="showSendPhoto()">Enviar foto</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="user-informations">
                        <h3 class="font-size-2-bold">{{ $root.user.nome }}</h3>
                        <div class="user-medals">
                            <div class="user-medal-container" v-for="(medal, index) in $root.user.user_medals" :key="index">
                                <img :src="require('../assets/img/medal-' + medal.id + '.svg')" class="user-medal" :title="medal.medal_description">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tabs-list-menu">
                    <ul>
                        <li class="menu-item selected font-size-3" id="principal" v-on:click="selectTab(0)">
                            Informações principais
                            <div class="menu-underline"></div>
                        </li>
                        <li class="menu-item font-size-3" id="settings" v-on:click="selectTab(1)">
                            Configurações
                            <div class="menu-underline"></div>
                        </li>
                        <li class="menu-item font-size-3" id="account-center" v-on:click="selectTab(2)">
                            Central de contas
                            <div class="menu-underline"></div>
                        </li>
                    </ul>
                </div>
                <div class="tabs-content">
                    <div class="account-informations">
                        <div class="profile-form-container">
                            <div class="user-occupations" :style="loadingOccupations ? 'opacity: 0;' : ''">
                                <p class="add-occupation-label" v-if="$root.user.user_occupations.length == 0 && !addOccupation">Adicione um cargo</p>
                                <div class="occupation" v-for="(occupation, index) in $root.user.user_occupations" :key="index" :id="'cargo-' + index">
                                    <p class="font-size-5">{{ occupation.occupation_name }}</p>
                                    <div class="exclude-occupation" v-on:click="excludeOccupation(occupation.occupation_name, index)">
                                        <span class="material-icons">clear</span>
                                    </div>
                                </div>
                                <input type="text" class="occupation-input" placeholder="Cargo" v-if="addOccupation" v-on:focusout="sendOccupation()" maxlength="50">
                                <span class="material-icons add-occupation" v-on:click="showOccupationInput()">add_circle</span>
                            </div>
                        </div>
                        <hr>
                        <div class="user-achievements">
                            <p class="font-size-3-bold user-achievements-title">Conquistas</p>
                            <div class="user-achievements-container">
                                <div class="achievement" v-for="(achievement, index) in $root.user.user_achievements" :key="index" :title="achievement.achievements_description">
                                    <div class="achievement-icon">
                                        <span class="material-icons">
                                            {{ findAchievementIcon(achievement.achievements_name) }}
                                        </span>
                                    </div>
                                    <p class="font-size-5"><strong>{{ achievement.achievements_name }}</strong></p>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="user-biography">
                            <div class="user-biography-header">
                                <p class="font-size-3-bold">Biografia</p>
                                <span class="material-icons" v-on:click="editBio()">edit</span>
                            </div>
                            <p class="bio" v-if="!editing_bio">{{ $root.user.user_bio }}</p>
                            <p class="bio" v-if="$root.user.user_bio == null && !editing_bio"><i>Conte sobre você...</i></p>
                            <div class="edit-bio" v-if="editing_bio">
                                <textarea name="user_bio" id="user-bio" rows="7" v-model="$root.user.user_bio" v-on:keyup="countCharacters()" v-on:focusout="saveBio($event)" maxlength="500"></textarea>
                                <p class="bio-counter">0 / 500</p>
                            </div>
                        </div>
                        <hr>
                        <div class="user-groups">
                            <div class="user-groups-header">
                                <p class="font-size-3-bold">Meus grupos</p>
                                <span class="material-icons" v-on:click="showNewGroupFunction()">add</span>
                            </div>
                            <div class="group" v-for="(group, index) in $root.user.user_groups" :key="index">
                                <router-link :to="{ name: 'edit-groups', params: { id: group.groups_id } }">
                                <div class="group">
                                    <div class="background-image" :style="`background-image: url('${group.image}')`"></div>
                                    <h4>{{ group.group_name }}</h4>
                                </div>
                            </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="account-settings">
                        <div class="preferences">
                            <p class="font-size-3-bold">Preferências</p>
                            <div class="form-group">
                                <div class="radio-group">
                                    <input type="checkbox" id="notifications" v-model="notifications.enable">
                                    <label for="notifications">Desejo receber lembretes de uso da plataforma</label>
                                </div>
                                <form @submit.prevent="updatePreferences()" v-if="notifications.enable" style="padding-left: 3rem;">
                                    <div class="radio-group" v-if="notifications.enable">
                                        <input type="radio" id="whatsapp" :checked="notifications.enable" required>
                                        <label for="whatsapp">Por Whatsapp</label>
                                    </div>
                                    <input type="tel" v-model="notifications.tel" placeholder="Celular (XX) XXXXX-XXXX" inputmode="numeric" maxlength="11" required>
                                    <input type="number" v-model="notifications.days_recurrency" placeholder="Frequência de envio (dias)" required>
                                    <button type="submit" class="btn primary" v-if="!isEqual(notifications, notifications2) && !saved">Salvar</button>
                                </form>
                            </div>
                        </div>
                        <hr>
                        <div class="user-change-password">
                            <p class="font-size-3-bold">Segurança</p>
                            <button type="button" v-if="!reset_password_sent" v-on:click="requestResetPassword()" id="reset-password-button">Redefinir minha senha</button>
                            <div class="reset-password-in-progress" v-if="reset_password_sent">
                                <span class="material-icons">check_circle</span>
                                <p class="font-size-4-bold">{{ password_response }}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="exclude-account">
                            <p class="font-size-3-bold">Encerrar conta</p>
                            <div class="exclude-account-container">
                                <p>Excluir sua conta da Cademint</p>
                                <button type="button" v-on:click="showExcludeAccountModal()">Excluir</button>
                            </div>
                            <div class="delete-user-confirmation-modal">
                                <h4 class="font-size-h5">Tem certeza que deseja excluir a sua conta?</h4>
                                <div class="exclude-account-buttons">
                                    <button id="exclude-account-confirmation-button" class="font-size-3" v-on:click="excludeAccount">Sim, excluir</button>
                                    <button id="skip-exclude-confirmation" class="font-size-3" v-on:click="hideExcludeAccountModal">Não, cancelar</button>
                                </div>
                                <div class="exclude-account-warning" v-if="!isDeleting">
                                    <h6 class="font-size-4"><span><strong>ATENÇÃO</strong></span>, essa ação é <span><strong>irreversível</strong></span>!</h6>
                                    <p class="font-size-5">
                                        Ao excluir sua conta, todas as suas informações pessoais são apagadas. <br>
                                        Qualquer dúvida entre em contato pelo nosso email: 
                                    </p>
                                    <a href="mailto:contato.scrumcademint@gmail.com" class="font-size-6">contato.scrumcademint@gmail.com</a>
                                </div>
                                <div class="deleting-message" v-if="isDeleting">
                                    <h6>Apagando usuário...</h6>
                                    <div class="loading"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="account-center">
                        <accountCenter />
                    </div>
                </div>
            </div>
            
            <div class="modal-expanded-photo">
                <img />
            </div>

            <div class="overlay" v-on:click="hidePhoto();" v-if="showExpandedPhoto"></div>
            <div class="wrapper" v-on:click="hideBannerDetails(); hidePhotoDetails();" v-if="showPhotoDetails || showBannerDetails"></div>
            
            <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :modalbutton2="modalButton2" @closeModal="hideSendPhoto(); hideExcludeAccountModal(); hideNewGroupFunction(); closeModalFunction();">
                <newGroupModal v-if="showNewGroup" :showNewGroup="showNewGroup" @savedContent="closeModalFunction(); hideSendPhoto(); hideNewGroupFunction();" /> 
                <uploadModal :data_target="data_target" v-if="showSendPhotoContainer" @savedContent="closeModalFunction(); hideSendPhoto();"></uploadModal>
            </modal>
        </div>
    </section>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';
import modal from "./modal.vue";
import uploadModal from './uploadImageModal.vue';
import newGroupModal from './newGroupModal.vue';
import accountCenter from "./accountCenter.vue";

export default {
    name: "updateProfile",
    mixins: [globalMethods],
    data() {
        return {
            data_target: "",
            showSubmit: false,
            showPhotoDetails: false,
            showBannerDetails: false,
            showExpandedPhoto: false,
            showSendPhotoContainer: false,
            loading: true,
            showProfileMoreOptions: false,
            showExcludeAccount: false,
            isDeleting: false,
            addOccupation: false,
            editing_bio: false,
            password_response: "",
            reset_password_sent: false,
            loadingOccupations: false,
            showNewGroup: false,
            notifications: JSON.parse(JSON.stringify(this.$root.user.notifications)),
            notifications2: JSON.parse(JSON.stringify(this.$root.user.notifications)),
            saved: false
        }
    },
    watch: {
        "notifications.enable": function () {
            if (!this.notifications.enable) {
                this.updatePreferences();
            }
        },
        showProfileMoreOptions: function () {
            let self = this;
            if (self.showProfileMoreOptions) {
                $(".account-options").show();
                setTimeout(() => {
                    $(".account-options").css("opacity", 1);
                }, 10);
            } else {
                $(".account-options").css("opacity", 0);
                setTimeout(() => {
                    $(".account-options").hide();
                }, 400);
            }
        }
    },
    methods: {
        isEqual: function (obj1, obj2) {
            let result = JSON.stringify(obj1) == JSON.stringify(obj2);
            
            if (!result) {
                this.saved = false;
            }

            return result;
        },
        updatePreferences: function () {
            let self = this;

            api.post("/users/update_preferences", { preferences: self.notifications }).then(() => {
                self.notifications2 = JSON.parse(JSON.stringify(self.notifications));
                self.saved = true;
            });
        },
        selectTab: function (menu) {
            let principal = $("#principal");
            let settings = $("#settings");
            let accountCenter = $("#account-center");
            let accountInformations = $(".account-informations");
            let accountSettings = $(".account-settings");
            let accountCenterContainer = $(".account-center");

            principal.removeClass("selected");
            settings.removeClass("selected");
            accountCenter.removeClass("selected");
            
            accountInformations.hide();
            accountSettings.hide();
            accountCenterContainer.hide();

            switch (menu) {
                case 0:
                    accountInformations.show();
                    principal.addClass("selected");
                    break;
                case 1:
                    settings.addClass("selected");
                    accountSettings.show();
                    break;
                case 2:
                    accountCenter.addClass("selected");
                    accountCenterContainer.show();
                    break;
            }
        },
        requestResetPassword: function () {
            let self = this;
            let button = $("#reset-password-button");

            if (confirm("Deseja mesmo redefinir a sua senha?")) {
                button.html("Enviando...").attr("disabled", "disabled");

                let data = {
                    email: self.$root.user.email
                }

                api.post("/users/forgot_password", data)
                .then(function (response) {
                    self.password_response = response.data.message;
                    self.reset_password_sent = true;
                    button.html("Esqueci minha senha").attr("disabled", false);
                })
            }
        },
        countCharacters: function () {
            let counter = $(".bio-counter");
            let input = $("#user-bio");
            counter.html(input.val().length + " / 500");
        },
        saveBio: function (event) {
            let self = this;
            let value = event.target.value;

            if (value.length > 500 || value.length < 3 || value == "") {
                self.closeBio();
                return;
            }
            
            let data = {
                user_bio: event.target.value
            }

            api.patch("/users/change_bio", data)
            .then(function () {
                self.closeBio();
                self.$root.user.user_bio = value;
                self.requireUser(true);
            })
        },
        editBio: function () {
            this.editing_bio = true;
            setTimeout(() => {
                $("#user-bio").focus();
                this.countCharacters();
            }, 10);
        },
        closeBio: function () {
            this.editing_bio = false;
        },
        excludeOccupation: function (occupationName, index) {
            let self = this;
            let data = {
                user_occupation: occupationName
            }
            
            self.loadingOccupations = true;

            api.patch('/users/exclude_occupation', data)
            .then(function () {
                self.requireUser(true).then(() => {
                    self.loadingOccupations = false;
                });

                $("#cargo-" + index).remove();
            })
        },
        sendOccupation: function () {
            let value = $(".occupation-input").val();
            let self = this;
            let data = {
                user_occupation: value
            }
            if (value == "" || value.length < 3) {
                this.addOccupation = false;
                return;
            }
            api.patch("/users/add_occupation", data)
            .then(function () { 
                self.requireUser(true).then(() => {
                    self.addOccupation = false;
                });
            })
            .catch(function () {
                self.addOccupation = false;
            })
        },
        showOccupationInput: function () {
            this.addOccupation = true;
            setTimeout(() => {
                $(".occupation-input").focus();
            }, 10);
        },
        hidePhotoDetails: function () {
            this.showPhotoDetails = false;
        },
        hideBannerDetails: function () {
            this.showBannerDetails = false;
        },
        findAchievementIcon: function (achievement_name) {
            let iconClass;
            switch (achievement_name) {
                case 'Novo usuário':
                    iconClass = "person";
                    break;
                case 'Verificado':
                    iconClass = "verified_user";
                    break;
                case 'Perfil completo':
                    iconClass = "how_to_reg";
                    break;
                case 'Início de carreira':
                    iconClass = "rocket_launch";
                    break;
                case 'Atarefado':
                    iconClass = "checklist";
                    break;
                case 'Muito atarefado':
                    iconClass = "pending_actions";
                    break;
                case 'Chefinho':
                    iconClass = "man";
                    break;
                case 'Manda chuva':
                    iconClass = "record_voice_over";
                    break;
                case 'Usuário frequente':
                    iconClass = "event_available";
                    break;
                case 'Antisocial':
                    iconClass = "person_off";
                    break;
                case 'Sociável':
                    iconClass = "people";
                    break;
                case 'Viciado':
                    iconClass = "vaccines";
                    break;
                case 'Sem vida social':
                    iconClass = "social_distance";
                    break;
                case 'Hacker':
                    iconClass = "code";
                    break;
                case 'Soberano':
                    iconClass = "attach_money";
                    break;
                case 'Dono da Cademint':
                    iconClass = "copyright";
                    break;
                case 'Magnata':
                    iconClass = "insights";
                    break;
            }
            return iconClass;
        },
        setLevelProgress: function () {
            let progress = this.$root.user.level_progress;
            let circleElement = $("#circle-progress");
            circleElement.css("stroke-dashoffset", 495 - (495 * parseInt(progress) / 100));
        },
        removeBanner: function (from_upload = false) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            api.patch("/users/exclude_banner", "", {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(async function(){
                self.requireUser(true);
                if (!from_upload) {
                    location.reload();
                }
            })
        },
        showSendPhoto: function (banner = false) {
            if (banner) {
                this.data_target = "banner"
            }

            this.showModalFunction("Enviar foto", "Enviar", "Cancelar");
            this.showSendPhotoContainer = true;
        },
        hideSendPhoto: function () {
            this.showSendPhotoContainer = false;
        },
        showNewGroupFunction: function () {
            this.showModalFunction("Criar grupo", "Criar", "Cancelar");
            this.showNewGroup = true;
        },
        hideNewGroupFunction: function () {
            this.showNewGroup = false;
        },
        showPhoto: function () {
            let modal = $(".modal-expanded-photo");
            let img = $(".modal-expanded-photo img");
            modal.show();
            img.attr("src", this.$root.user.profile_photo).attr("title", "Foto de " + this.$root.user.nome);
            this.showExpandedPhoto = true;
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        showBanner: function () {
            let modal = $(".modal-expanded-photo");
            let img = $(".modal-expanded-photo img");
            modal.show();
            img.attr("src", this.$root.user.user_cover_image).attr("title", "Banner de " + this.$root.user.nome);
            this.showExpandedPhoto = true;
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        hidePhoto: function () {
            let modal = $(".modal-expanded-photo");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                modal.hide();
                this.showExpandedPhoto = false;
                this.showBannerDetails = false;
            }, 400);
        },
        hideExcludeAccountModal: function () {
            let container = $(".delete-user-confirmation-modal"), self = this;

            container.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                container.hide();
                self.showExcludeAccount = false;
            }, 400);
        },
        showExcludeAccountModal: function () {
            let container = $(".delete-user-confirmation-modal"), self = this;

            container.css("display", "flex");
            setTimeout(() => {
                container.css("opacity", 1).css("transform", "translateY(0)");
                self.showExcludeAccount = true;
            }, 10);
        },
        excludeAccount: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            self.isDeleting = true;

            api.post("/users/exclude_user", "", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function () { 
                self.logoutUser(true);
                self.$router.push("/login");
            })
        },
        togglePhotoDetails: function () {
            this.showPhotoDetails = !this.showPhotoDetails;
        },
        toggleBannerDetails: function () {
            this.showBannerDetails = !this.showBannerDetails;
        },
    },
    mounted: function () {
        this.requireUser(true).then(() => {
            this.loading = false;
            this.$nextTick(() => {
                this.selectTab(0);
            })
        })
    },
    components: {
        uploadModal,
        newGroupModal,
        accountCenter,
        modal
    }
}
</script>
<style scoped>
.tabs-content > div {
    padding-top: 1.5rem;
}

.wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
}

.delete-user-confirmation-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    background: var(--white);
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 1rem;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    display: none;
    /*display: flex;*/
    flex-direction: column;
    justify-content: center;
    z-index: 9999;
    text-align: center;
}

.exclude-account-buttons {
    margin: .7rem 0;
}

    .exclude-account-buttons button {
        padding: 10px 15px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        margin: 5px;
        transition: all 0.4s;
    }

    .exclude-account-buttons button:nth-child(1):hover {
        background: var(--gray-high);
    }

    .exclude-account-buttons button:nth-child(2) {
        background: var(--blue);
        color: var(--white);
    }

        .exclude-account-buttons button:nth-child(2):hover {
            background: var(--blue-low);
        }

    .exclude-account-warning span {
        text-transform: uppercase;
        color: var(--red);
    }

    .exclude-account-warning p {
        margin: 10px 0;
    }

    .exclude-account-warning a {
        margin-top: 5px;
        color: var(--blue);
    }

        .exclude-account-warning a:hover {
            text-decoration: underline;
        }

.deleting-message h6 {
    font-size: 1.3rem;
}

.overlay, .loading {
    display: block;
}

.update-profile-container {
   width: 100%;
   display: flex;
   justify-content: center;
}

.modal-expanded-photo {
    background: white;
    border-radius: 10px;
    width: 80vw;
    height: 80vh;
    max-height: 800px;
    max-width: 800px;
    min-height: 200px;
    min-width: 200px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding: 25px;
    position: fixed;
    display: none;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 9999;
}

    .modal-expanded-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

@media (max-width: 720px) {
    .modal-expanded-photo {
        width: 95vw;
        padding: .5rem;
        height: 70vh;
    }
}

.profile-more-options {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 7px;
    cursor: pointer;
}

    .profile-more-options .material-icons {
        font-size: 2rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 0.4s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

        .profile-more-options .material-icons:hover {
            background: var(--gray-high);
        }

.account-options-container {
    position: relative;
}

.account-options {
    opacity: 0;
    display: none;
    position: absolute;
    top: -32px;
    right: 50px;
    background: var(--white);
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    padding: .5rem;
    min-width: 150px;
    border-radius: 10px;
    transition: all 0.4s;
    z-index: 3;
}

    .account-options ul {
        list-style: none;
        text-align: center;
    }

    .account-options li {
        padding: .5rem;
    }

        .account-options li:hover {
            background: var(--gray-high);
        }

.profile-avatar {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 0 0 7px var(--gray-soft);
}

.informations-container {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: -90px;
}

    .informations-container hr {
        width: 100%;
    }

.informations-container > div:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    margin-top: 5rem;
}

.profile-form-container {
    width: 100%;
}

@media (max-width: 720px) {
    .user-banner {
        width: 100vw !important;
        margin-left: -1rem !important;
        margin-top: -1rem !important;
    }
}

@media (max-width: 580px) {
    .informations-container {
        display: flex;
        flex-direction: column;
    }

    .profile-form-container {
        flex-direction: column !important;
        align-items: center;
        width: 80%;
    }

        .profile-form-container form {
            margin-top: 1rem;
        }

    .profile-more-options .material-icons {
        font-size: 1.3rem;
    }

    .profile-form-container form input, .profile-form-container form button {
        height: 35px !important;
        font-size: 1rem !important;
    }

    .group {
        margin: .7rem 0;
    }

    .update-profile-container {
        overflow-y: scroll;
    }
}

.profile-form-container form {
    display: flex;
    flex-direction: column;
}

.profile-form-container form input, .profile-form-container form button {
    width: 100%;
    margin: .5rem 0;
    height: 40px;
    border-radius: 6px;
    border: none;
    font-size: 1.2rem;
}

.profile-form-container form input {
    border: 1px solid var(--gray);
    padding: 8px;
}

.profile-form-container form button {
    background: var(--blue);
    color: var(--white);
    cursor: pointer;
    transition: all 0.4s;
}

    .profile-form-container form button:hover {
        background: var(--blue-low);
    }

.other-groups-list {
    height: 100%;
    overflow-y: scroll;
}

.group {
    margin: .5rem 0;
    display: flex;
    align-items: center;
}

    .group .background-image {
        width: 50px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        box-shadow: 0 0 0 4px var(--blue);
        margin-right: 2rem;
    }

.user-image-container {
    position: relative;
    background: var(--gray-high);
    border-radius: 50%;
}

.photo-details {
    bottom: 0;
    right: -120px;
}

.photo-details, .banner-details {
    background: var(--white);
    border-radius: 10px;
    padding: .4rem;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    position: absolute;
    z-index: 3;
}

.banner-details {
    right: 20px;
    top: 70px;
}

.photo-details ul, .banner-details ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

        .photo-details ul li, .banner-details ul li {
            padding: .5rem;
            width: 100%;
            text-align: center;
            cursor: pointer;
        }

            .photo-details ul li:hover, .banner-details ul li:hover {
                background: var(--gray-high);
            }

@media (max-width: 470px) {
    .photo-details {
        bottom: -120px;
        right: 0;
        width: 300%;
    }
}

.change-photo {
    background: var(--white);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    bottom: 10px;
    right: -10px;
}

    .change-photo:hover {
        background: var(--gray-high);
    }



/* NOVO VISUAL DO PERFIL */
.user-banner {
    height: 200px;
    width: calc(100% + 4rem);
    margin-left: -2rem;
    margin-top: -2rem;
    border-radius: 10px 10px 0 0;
    background: var(--gray-high);
    overflow: hidden;
    position: relative;
    background-size: cover;
}

.user-level-badge {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    bottom: -15px;
    margin: auto;
    width: fit-content;
    background-image: linear-gradient(to right, var(--blue), var(--blue-low));
    color: var(--white);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 14px;
}

circle {
    fill: none;
    stroke: url(#GradientColor);
    stroke-width: 6px;
    stroke-dasharray: 495;
    stroke-dashoffset: 495;
    transition: stroke-dashoffset 0.08s;
    transition-timing-function: ease-in-out;
}

svg {
    position: absolute;
    left: -10px;
    top: -10px;
    transform: rotate(-90deg);
}

.change-banner {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 10px 20px;
    border-radius: 10px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: var(--blue);
    transition: all 0.2s;
    background: var(--white);
}

    .change-banner:hover {
        background: var(--gray-soft);
    }

    .change-banner span:first-child {
        margin-right: 10px;
    }

    .change-banner span:not(:first-child) {
        font-weight: 600;
        letter-spacing: 1px;
    }

.user-occupations {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    flex-wrap: wrap;
}

    .user-occupations .occupation {
        background: var(--gray-soft);
        padding: 5px 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        margin: 3px 10px 3px 0;
    }

.exclude-occupation {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: fit-content;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(1px);
    padding: 0 5px;
    /*display: flex;*/
    display: none;
    align-items: center;
    justify-content: center;

}

    .exclude-occupation span {
        font-size: 20px;
    }

.occupation:hover .exclude-occupation {
    display: flex;
}

.user-achievements {
    width: 100%;
    margin: 10px 0;
}

.user-biography {
    margin: 10px 0;
    width: 100%;
}

    .user-biography .bio {
        color: var(--gray-low);
    }

.user-biography-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

    .user-biography-header span {
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.4s;
    }

        .user-biography-header span:hover {
            cursor: pointer;
            background: var(--gray-soft);
        }

.user-change-password {
    margin: 1rem 0;
}

    .user-change-password button {
        margin-top: 1rem;
        background: var(--blue);
        color: var(--white);
    }

        .user-change-password button:hover {
            background: var(--blue-low);
        }

.reset-password-in-progress {
    display: flex;
    align-items: center;
    margin-top: 1rem;
}

    .reset-password-in-progress span {
        font-size: 50px;
        color: var(--green);
        margin-right: 1rem;
    }

.exclude-account-container button, .user-change-password button {
    padding: 7px 15px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.4s;
}

.exclude-account-container {
    display: flex;
    align-items: center;
}

    .exclude-account-container button {
        display: flex;
        align-items: center;
        background: var(--red);
        color: var(--white);
    }

        .exclude-account-container button:hover {
            background: var(--red-low);
        }

    .exclude-account-container p {
        margin-right: 1rem;
    }

.exclude-account {
    margin-bottom: 2rem;
}

#user-bio {
    resize: none;
    width: 100%;
    color: var(--black);
    padding: 5px 8px;
    border-radius: 6px;
    font-size: 16px;
    border: 1px solid var(--gray-low);
}

.user-groups {
    margin: 10px 0;
    width: 100%;

    & .user-groups-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & span {
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.4s;

            &:hover {
                cursor: pointer;
                background: var(--gray-soft);
            }
        }
    }
}

.achievement {
    width: 120px;
    height: 150px;
    background: var(--gray-soft);
    border-radius: 6px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-right: 10px;
}

.user-achievements-title {
    margin-bottom: 10px;
}

.user-achievements-container {
    display: flex;
    align-items: center;
}

.user-informations {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: var(--space-7);
}

.user-medals {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-medal-container {
    height: 100%;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-medal {
    width: 30px;
    cursor: pointer;
    transition: all 0.4s;
}

    .user-medal:hover {
        width: 35px;
        cursor: pointer;
    }

.achievement-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--gray-high);
    display: flex;
    align-items: center;
    justify-content: center;
}

    .achievement-icon span {
        font-size: 45px;
    }

.add-occupation {
    margin: 0 10px;
    font-size: 30px;
    cursor: pointer;
    transition:all 0.4s;
    color: var(--gray-low);
}

@media (max-width: 450px) {
    .add-occupation {
        opacity: 1 !important;
    }
}

.occupation-input {
    height: 27px;
    border-radius: 6px;
    border: 1px solid var(--gray-low);
    padding: 10px;
    flex: 1;
    min-width: 150px;
}

.add-occupation-label {
    color: var(--gray-low);
    font-style: italic;
}

@media (max-width: 480px) {
    .user-occupations {
        padding-bottom: 3rem;
        position: relative;
    }
    .user-occupations .occupation {
        padding-right: 38px;
    }

    .exclude-occupation {
        display: flex !important;
    }

    .add-occupation-label {
        display: none;
    }

    .add-occupation {
        opacity: 1 !important;
        position: absolute;
        left: 0;
        bottom: 0;
        margin: 0;
    }
}
</style>
