<template>
    <div class="manage-groups-container">
        <div class="manage-groups_modal">
            <div class="modal-header">
                <h1>Gerenciar projetos</h1>
                <span class="material-icons" id="close-manage-projects-modal" v-on:click="closeModal">close</span>
            </div>
            <div class="modal-body">
                <div class="responsive-group-modal-body">
                    <ul>
                        <li id="responsive-my-groups" v-on:click="editMyGroups = true; editOtherGroups = false" :style="editMyGroups ? 'background: var(--gray-high);' : ''">Meus grupos</li>
                        <li id="responsive-other-groups" v-on:click="editMyGroups = false; editOtherGroups = true" :style="editOtherGroups ? 'background: var(--gray-high);' : ''">Outros grupos</li>
                    </ul>
                    <div class="responsive-edit-my-groups" v-if="editMyGroups">
                        <div class="responsive-group" v-for="group in my_groups" :key="group.groups_id" :id="'responsive-group-' + group.groups_id" v-on:click="addActiveClass('#responsive-group-' + group.groups_id, true); editResponsiveGroup('#responsive-group-' + group.groups_id + ' .responsive-group-body', $event)">
                            <div class="group my-group"><h5>{{ group.group_name }}</h5><span class="material-icons" v-if="my_groups.length > 1" v-on:click="excludeGroup(group.groups_id)">delete</span></div>
                            <div class="responsive-group-body">
                                <div class="responsive-members-list-container">
                                    <div class="responsive-members-list">
                                        <div class="member" v-for="group_user in group.group_members" :id="'responsive-user-' + group_user.id_usuario" :key="group_user.id_usuario" :style="group_user.id_usuario == group.group_members[group.group_members.length - 1].id_usuario ? 'border: none' : ''">
                                            <img :src="group_user.profile_photo" class="avatar-p" :alt="'Imagem de ' + group_user.nome">
                                            <h1>{{ group_user.nome }}</h1>
                                            <span class="material-icons remove-user" v-on:click="excludeUser(group.groups_id, group_user.id_usuario, false, true)" v-if="group_user.id_usuario != user.id_usuario && group.group_owner == user.id_usuario">close</span>
                                        </div>
                                        <div v-for="(member, index) in group.pending_users" :key="index">
                                            <div class="member requested-user" v-if="member != ''">
                                                <img src="https://scrum-cademint-api.herokuapp.com/public/default-user-image.png" class="avatar-p" :alt="'Imagem de ' + member">
                                                <h1>{{ member }}</h1>
                                                <i class="fas fa-hourglass-start hourglass-icon"></i>
                                            </div>
                                        </div>
                                        <div class="responsive-new-member-input-container" v-if="requestUser">
                                            <input type='email' placeholder='Insira o email' class='new-member-input' :id="'responsive-enter-group-input-' + group.groups_id" v-on:keyup="showSendButton($event)" v-on:focusout="validateEmailInput($event)" />
                                            <i class="fas fa-times" v-on:click="requestUser = false; save = false; response = ''"></i>
                                            <div class="loading" v-if="loading"></div>
                                        </div>
                                    </div>
                                    <div class="responsive-new-member" v-on:click="showRequestInput('#request-member-input', true)">
                                        <span class="material-icons">add_circle</span>
                                        <h6>Novo membro</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="responsive-edit-other-groups" v-if="editOtherGroups">
                        <div class="responsive-group" v-for="group in groups_i_participate" :key="group.groups_id" :id="'responsive-group-' + group.groups_id" v-on:click="addActiveClass('#responsive-group-' + group.groups_id, true); editResponsiveGroup('#responsive-group-' + group.groups_id + ' .responsive-group-body', $event)">
                            <div class="group other-group"><h5>{{ group.group_name }}</h5><span><h6 v-on:click="excludeUser(group.groups_id, user.id_usuario, true, true)">Sair</h6></span></div>
                            <div class="responsive-group-body">
                                <div class="responsive-members-list-container">
                                    <div class="responsive-members-list">
                                        <div class="member" v-for="group_user in group.group_members" :id="'responsive-user-' + group_user.id_usuario" :key="group_user.id_usuario" :style="group_user.id_usuario == group.group_members[group.group_members.length - 1].id_usuario ? 'border: none' : ''">
                                            <img :src="group_user.profile_photo" class="avatar-p" :alt="'Imagem de ' + group_user.nome">
                                            <h1>{{ group_user.nome }}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="groups-list">
                    <div class="my-groups">
                        <h6><strong>Meus grupos</strong></h6>
                        <ul class="my-groups-list">
                            <li v-for="group in my_groups" :key="group.groups_id" class="group my-group" :id="'group-' + group.groups_id" v-on:click="editing_group = group; group_owner = group.group_owner; addActiveClass('#group-' + group.groups_id);" :style="my_groups.length == 1 ? 'padding: 0.2rem 1rem;' : ''">{{group.group_name}}<span class="material-icons" v-on:click="excludeGroup(group.groups_id)" v-if="my_groups.length > 1">delete</span></li>
                        </ul>
                    </div>
                    <div class="groups-i-participate">
                        <h6><strong>Outros grupos</strong></h6>
                        <ul class="other-groups-list">
                            <li v-for="group in groups_i_participate" :key="group.groups_id" class="group other-group" :id="'group-' + group.groups_id" v-on:click="editing_group = group; group_owner = group.group_owner; addActiveClass('#group-' + group.groups_id);">{{group.group_name}}<h6 v-on:click="excludeUser(group.groups_id, user.id_usuario, true)">Sair</h6></li>
                        </ul>
                    </div>
                </div>
                <div class="edit-group">
                    <input type="hidden" id="current_project">
                    <div class="members-list-container">
                        <div class="members-list">
                            <div class="member" v-for="group_user in editing_group.group_members" :id="'user-' + group_user.id_usuario" :key="group_user.id_usuario">
                                <img :src="group_user.profile_photo" class="avatar-p" :alt="'Imagem de ' + group_user.nome">
                                <h1>{{ group_user.nome }}</h1>
                                <div class="remove-user" v-if="group_user.id_usuario != user.id_usuario && group_owner == user.id_usuario">
                                    <span class="material-icons" v-on:click="excludeUser(editing_group.groups_id, group_user.id_usuario)">close</span>
                                </div>
                            </div>
                            <div v-for="(member, index) in editing_group.pending_users" :key="index">
                                <div class="member requested-user" v-if="member != ''">
                                    <img src="https://scrum-cademint-api.herokuapp.com/public/default-user-image.png" class="avatar-p" :alt="'Imagem de ' + member">
                                    <h1>{{ member }}</h1>
                                    <i class="fas fa-hourglass-start hourglass-icon"></i>
                                </div>
                            </div>
                            <div class="new-member-input-container" v-if="requestUser">
                                <input type='email' placeholder='Insira o email' class='new-member-input' id="request-member-input" v-on:keyup="showSendButton($event)" v-on:focusout="validateEmailInput($event)" />
                                <i class="fas fa-times" v-on:click="requestUser = false; save = false; response = ''"></i>
                                <div class="loading" v-if="loading"></div>
                            </div>
                        </div>
                    </div>
                    <div class="new-member" v-on:click="showRequestInput('#request-member-input')">
                        <span class="material-icons">add_circle</span>
                        <h6>Novo membro</h6>
                    </div>
                </div>
            </div>
            <div class="response">{{response}}</div>
            <div class="loading"></div>
            <div class="modal-footer">
                <button class="create-button" v-if="save" v-on:click="sendEmailToEnterGroup('#request-member-input', is_responsive)">Salvar</button>
                <button class="cancelate-button" v-on:click="closeModal">Cancelar</button>
            </div>
        </div>
        <div class="overlay" v-on:click="hideModal"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';

export default {
    name:  'editGroupsModal',
    props: ['show_modal', 'user'],
    mixins: [globalMethods],
    data() {
        return {
            updatedUser: {},
            editing_group: {},
            group_owner: null,
            save: false,
            requestUser: false,
            loading: false,
            response: "",
            interval: null,
            my_groups: this.getMyGroups(),
            groups_i_participate: this.getGroupsIParticipate(),
            editOtherGroups: false,
            editMyGroups: true,
            showResponsiveBody: null,
            is_responsive: false
        }
    },
    mounted() {
        this.showResponsiveBody = this.my_groups[0].groups_id;
        this.selectFirstElementInResponsive();
        if (window.innerWidth < 580) {
            this.is_responsive = true;
        }
    },
    watch: {
        show_modal: function () {
            if (this.show_modal) {
                this.showModal();
                setTimeout(() => {
                    this.initiateHourglassAnimation();
                }, 500);
                return;
            }
            this.hideModal();
        }
    },
    methods: {
        updateUser: async function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            self.updatedUser = await api.get("/usuarios/return_user", { headers: { Authorization: jwt } }).then(res => res.data.response);
        },
        refilGroups: function () {
            this.updateUser();
            setTimeout(() => {
                this.my_groups = this.getMyGroups(true);
                setTimeout(() => {
                    this.initiateHourglassAnimation();
                    $(".responsive-group.active").find(".responsive-members-list").scrollTop(99999);
                }, 10);
            }, 300);
        },
        selectFirstElementInResponsive: function () {
            $(".responsive-edit-my-groups .group:first-child .responsive-group-body").show();
        },
        editResponsiveGroup: function (element_id, event) {
            if (event.target.nodeName == "I") {
                return;
            }
            let element = $(element_id);
            $(".responsive-group-body").hide();
            if (element.is(":visible")) {
                element.hide();
            } else {
                element.css("display", "flex");
            }
        },
        getMyGroups: function (update = false) {
            let groups, self = this, my_groups = [];
            if (!update) {
                groups = self.user.user_groups
            } else {
                groups = self.updatedUser.user_groups;
            }
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].group_owner == self.user.id_usuario) {
                    my_groups.push(groups[i]);
                }
            }
            return my_groups;
        },
        getGroupsIParticipate: function () {
            let self = this, groups = self.user.user_groups, groups_i_participate = [];
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].group_owner != self.user.id_usuario) {
                    groups_i_participate.push(groups[i]);
                }
            }
            return groups_i_participate;
        },
        initiateHourglassAnimation: function (stop = false) {
            let icon = $(".hourglass-icon"), self = this;
            if (!stop) {
                self.interval = setInterval(() => {
                    if (icon.hasClass("fa-hourglass-start")) {
                        icon.removeClass("fa-hourglass-start").addClass("fa-hourglass-half");
                    } else if (icon.hasClass("fa-hourglass-half")) {
                        icon.removeClass("fa-hourglass-half").addClass("fa-hourglass-end");
                    } else if (icon.hasClass("fa-hourglass-end")) {
                        icon.removeClass("fa-hourglass-end").addClass("fa-hourglass-start");
                    }
                }, 1000);
            } else {
                clearInterval(self.interval);
            }
        },
        showRequestInput: function (input_id, responsive = false) {
            this.requestUser = true;
            setTimeout(() => {
                if (!responsive) {
                    $(input_id).focus();
                } else {
                    $(".responsive-group.active").find(".new-member-input").focus();
                }
            }, 10);
        },
        excludeUser: function (project_id, id_usuario, leaving_group = false, responsive = false) { // Exclui o usuário do grupo.
                let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

                if (leaving_group) {
                    if (responsive) {
                        $("#responsive-group-" + project_id).hide();
                        self.groups_i_participate = self.groups_i_participate.filter(group => {return group.groups_id != project_id});
                    } else {
                        $("#group-" + project_id).hide();
                    }
                    self.response = "Você saiu do grupo";
                    
                } else {
                    if (responsive) {
                        $("#responsive-user-" + id_usuario).hide();
                    } else {
                        $("#user-" + id_usuario).hide();
                    }
                    self.response = "Usuario excluido";
                }

                api.post("/projects/exclude_user", {
                    group_id: project_id,
                    user_id: id_usuario
                }, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(){
                    setTimeout(() => {
                        if (responsive) {
                            self.editFirstGroup(true);
                        } else {
                            self.editFirstGroup();
                        }
                    }, 100);
                })
        },
        sendEmailToEnterGroup: function (input_id, responsive = false) { // Função envia email de solicitação para o endereço informado, e ao final da requisição esconde o input.
            let inputValue = $(input_id).val(), self = this, jwt = "Bearer " + self.getJwtFromLocalStorage(), editingGroup = self.editing_group;

            if ($(".responsive-group.active").find("input[type='email']").hasClass("invalid-value") || $("#request-member-input").hasClass("invalid-value")) {
                self.response = "Email inválido";
                return;
            }
            if (responsive) {
                inputValue = $(".responsive-group.active").find(".new-member-input").val();
                editingGroup.group_name = $(".responsive-group.active .group h5").html();
                editingGroup.groups_id = $(".responsive-group.active").attr("id").replace("responsive-group-", "");
            }
            
            if (inputValue == self.user.email) {
                self.response = "Você não pode entrar em um grupo que já faz parte.";
                $(input_id).val("");
                return;
            }
            self.initiateHourglassAnimation(true);
            self.loading = true;
            self.response = "";
            let data = {
                user_email: inputValue,
                group_name: editingGroup.group_name,
                group_id: editingGroup.groups_id
            }
            setTimeout(() => {
                $(".create-button").attr("disabled", "disabled");
                api.post("/projects/request_user_to_group", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(){
                    self.loading = false;
                    self.save = false;
                    if (!responsive) {
                        editingGroup.pending_users.push(inputValue);
                        setTimeout(() => {
                            $(input_id).val("");
                            self.initiateHourglassAnimation();
                            $(".members-list").scrollTop(99999);
                            if (responsive) {
                                $(".responsive-members-list").scrollTop(99999);
                            }
                        }, 50);
                    } else {
                        self.refilGroups();
                        self.requestUser = false;
                        self.save = false;
                    }
                }).catch(function (error){
                    self.loading = false;
                    self.response = error.response.data.message;
                    if (!responsive) {
                        if (error.response.status == 409) {
                            $(input_id).val("");
                        }
                    } else {
                        $(".responsive-group.active").find(".new-member-input").val("");
                    }
                })
            }, 500);
        },
        excludeGroup: function (group_id) { // Função apaga o grupo solicitado.
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let data = {
                groups_id: group_id
            }
            api.delete("/projects/delete_group", { data, headers: {Authorization: jwt}})
            .then(function () {
                if (self.getCurrentProjectIdInSessionStorage() == group_id) { // Se o id do grupo que está sendo excluido for igual ao que está em session storage, o que está armazenado é deletado.
                    self.removeCurrentProjectIdInSessionStorage();
                }
                self.my_groups = self.my_groups.filter(group => {return group.groups_id != group_id});
                location.reload();
            })
        },
        showSendButton: function (event) {
            let inputValue = $("#" + event.target.id).val();
            if (inputValue.length > 0) {
                this.save = true;
            } else {
                this.save = false;
            }
        },
        validateEmailInput: function (event) {
            let target = $("#" + event.target.id), emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!emailRegex.test(target.val())) {
                target.addClass("invalid-value");
            } else {
                target.removeClass("invalid-value");
            }
        },
        addActiveClass: function (group_id, responsive = false) {
            if (!responsive) {
                $(".group").removeClass("active");
            } else {
                $(".responsive-group").removeClass("active");
            }
            $(group_id).addClass("active");
        },
        editFirstGroup: function (responsive = false) {
            let group = $(".my-groups-list .group:nth-child(1)"), responsiveGroupButton = $("#responsive-my-groups");
            if (!responsive) {
                group.click();
            } else {
                responsiveGroupButton.click();
                setTimeout(() => {
                    $(".responsive-edit-my-groups .responsive-group:nth-child(1)").click();
                }, 50);
            }
        },
        showModal: function () {
            let container = $(".manage-groups_modal"), overlay = $(".overlay");
            container.show();
            overlay.show();
            setTimeout(() => {
                container.css("transform", "translateY(0)").css("opacity", 1);
                if (window.innerWidth < 580) {
                    this.editFirstGroup(true);
                } else {
                    this.editFirstGroup();
                }
            }, 50);
        },
        hideModal: function () {
            let container = $(".manage-groups_modal"), overlay = $(".overlay");
            container.css("transform", "translateY(-100px)").css("opacity", 0);
            setTimeout(() => {
                container.hide();
                overlay.hide();
            }, 400);
        },
        closeModal: function () {
            this.$emit("close-modal");
        }
    }
}
</script>
<style scoped>
.response {
    margin-top: 0.7rem;
    font-size: .9rem;
    width: 65%;
}

@media (max-width: 875px) {
    .response {
        font-size: .8rem;
        width: 55%;
    }
}

.active {
    background: var(--gray-high-2);
}

.manage-groups_modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 70%;
    max-width: 800px;
    max-height: 600px;
    height: 60vh;
    background: var(--white);
    border-radius: 10px;
    transition: all 0.4s;
    opacity: 0;
    transform: translateY(-100px);
    z-index: 5;
    display: none;
}

    .manage-groups_modal .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.3rem;
        border-bottom: 1px solid var(--gray-high-2);
    }

        .manage-groups_modal .modal-header h1 {
            font-size: 1.2rem;
            margin: 0;
        }

        .manage-groups_modal .modal-header #close-manage-projects-modal {
            font-size: 1.5rem;
            color: black!important;
            cursor: pointer;
            line-height: 1rem;
        }

.manage-groups_modal .modal-body {
    height: calc(100% - 123px);
    position: relative;
    padding: 0 1rem .3rem;
}

.manage-groups_modal .modal-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    min-height: 65px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1rem;
    border-top: 1px solid var(--gray-high-2);
}

.manage-groups_modal .modal-footer button {
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.manage-groups_modal .modal-footer .create-button {
    background: var(--blue);
    color: white;
}

        .manage-groups_modal .modal-footer .create-button:hover {
            background: var(--blue-low);
        }

    .manage-groups_modal .modal-footer .cancelate-button {
        background: var(--gray-high);
        color: white;
    }

        .manage-groups_modal .modal-footer .cancelate-button:hover {
            background: var(--gray-low);
        }

@media (max-width: 976px) {
    .new-project-modal, .manage-groups_modal {
        width: 75%;
        height: 65vh;
    }
}
@media (max-width: 600px) {
    .manage-groups_modal {
        width: 98%;
    }

        .manage-groups_modal .modal-footer button {
            font-size: .9rem;
        }

        .manage-groups_modal .modal-header #close-manage-projects-modal {
            font-size: 1.3rem;
        }

        .manage-groups_modal .modal-header h1 {
            font-size: 1rem;
        }

        .new-member h6, .new-member span, .my-groups ul li, .groups-i-participate ul li {
            font-size: .8rem;
            padding: 0;
        }

    .groups-list h6 {
        font-size: 13px;
    }

    .modal-body {
        padding: .4rem!important;
    }
}

.responsive-group-modal-body {
    margin: auto;
    display: none;
    /*display: flex;*/
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

    .responsive-group-modal-body ul {
        list-style: none;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        margin-top: .5rem;
    }

        .responsive-group-modal-body ul li {
            margin: 0 1rem;
            cursor: pointer;
            background: var(--gray-high-2);
            padding: .5rem 1.5rem;
            border-radius: 10px;
            text-align: center;
        }

            .responsive-group-modal-body ul li:hover {
                background: var(--gray-high);
                color: var(--white);
            }

@media (max-width: 579px) {
    .groups-list, .edit-group {
        display: none;
    }

    .responsive-group-modal-body {
        display: flex;
    }
}

@media (max-width: 361px) {
    .responsive-edit-my-groups {
        max-height: calc(100% - 60px) !important;
        top: 60px !important;
    }
}

.responsive-edit-group {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 60px);
    overflow-y: scroll;
    margin: 0 .5rem;
}

.groups-list {
    height: 100%;
    width: 35%;
    text-align: center;
}

.my-groups {
    border-bottom: 1px solid var(--gray-high-2);
}

.my-groups, .groups-i-participate {
    height: 50%;
    max-height: 50%;
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-right: 1px solid var(--gray-high-2);
}

.my-groups-list, .other-groups-list {
    overflow-y: scroll;
    width: 100%;
    padding: 0 .5rem;
}

.groups-i-participate h6, .my-groups h6 {
    padding: .3rem 0;
}

    .my-groups ul, .groups-i-participate ul {
        display: inline-block;
        list-style: none;
    }

        .my-groups ul li, .groups-i-participate ul li {
            padding: 0.2rem 2rem 0.2rem 1rem;
            cursor: pointer;
            border-radius: .5rem;
            margin: .3rem 0;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

            .my-groups ul li:hover, .groups-i-participate ul li:hover, .responsive-group:hover {
                background: var(--gray-high-2);
            }

            .my-groups ul li span, .groups-i-participate ul li span, .other-groups-list h6 {
                position: absolute;
                margin: 0;
            }

            .groups-i-participate ul li span, .other-groups-list h6 {
                right: 15px;
            }

            .my-groups ul li span {
                right: 10px;
            }

            .other-groups-list h6 {
                font-size: .8rem;
            }

            .my-groups ul li .material-icons, .other-groups-list h6, .responsive-group .group .material-icons {
                color: var(--red);
            }

            .my-groups ul li .material-icons {
                font-size: 1.3rem;
            }

            .responsive-group .group .material-icons {
                font-size: 1.5rem;
            }

            .my-groups ul li .material-icons:hover, .other-groups-list h6:hover {
                color: var(--red-low);
            }

.groups-i-participate ul li {
    padding-right: 2.5rem;
}

.edit-group {
    position: absolute;
    right: 0;
    top: 0;
    width: 65%;
    height: 100%;
    padding: 1rem;
}

.edit-group .loading {
    position: absolute !important;
    right: 15px !important;
    top: 0;
    bottom: 0;
    margin: auto;
    display: block;
    background: var(--white);
}

.requested-user i {
    margin-left: 1rem;
}

.responsive-members-list-container {
    max-height: 120px;
    width: 70%;
    margin-bottom: 3rem;
    position: relative;
}

.responsive-new-member-input-container {
    position: absolute;
    bottom: 0;
    width: 90% !important;
    background: var(--gray-high-2);
    display: flex;
    align-items: center;
}

    .responsive-new-member-input-container input {
        width: 100% !important;
        margin-right: 1rem;
    }

.members-list-container {
    height: calc(100% - 50px);
    position: relative;
    padding-bottom: 1.7rem;
}

.members-list {
    height: 100%;
    overflow-y: scroll;
}

.responsive-members-list {
    overflow-y: scroll;
    padding: 0 1rem;
    height: 100%;
}

.new-member-input-container {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: -20px;
    width: 100%;
}

    .new-member-input-container i {
        cursor: pointer;
        margin-left: 1rem;
    }

.new-member-input {
    border: 1px solid var(--gray-high-2);
    border-radius: 7px;
    padding: 7px 15px;
    width: 80%;
    margin: .4rem 0;
}

.responsive-group .responsive-new-member {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: .5rem 1rem;
    border-radius: 10px;
    margin-top: .5rem;
}

    .responsive-group .responsive-new-member:hover {
        background: var(--gray-high);
        color: var(--white);
    }

    .responsive-group .responsive-new-member h6 {
        margin: 0;
        margin-left: 1rem;
    }

    .responsive-group .responsive-new-member i {
       font-size: 1.3rem;
    }

.new-member {
    position: absolute;
    bottom: .8rem;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 1.5rem;
    max-width: 11rem;
    cursor: pointer;
    padding: 15px;
    border-radius: .5rem;
    transition: all 0.4s;
}

    .new-member:hover {
        background: var(--gray-high-3);
    }

    .new-member h6 {
        margin: 0;
        margin-left: .5rem;
    }

.remove-user {
    margin-left: 1rem;
}

    .remove-user span {
        cursor: pointer;
        color: var(--red);
        margin-top: 5px;
    }

        .remove-user span:hover {
            color: var(--red-low);
        }

.member {
    display: flex;
    align-items: center;
    padding: .4rem;
    border-bottom: 1px solid var(--gray-high-2);
}

    .member h1 {
        font-size: 1.2rem;
        margin: 0;
        margin-left: 1rem;
        width: 70%;
        white-space: normal;
        text-overflow: ellipsis;
        overflow: hidden;
    }

.modal-body-loading {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

    .modal-body-loading .loading {
        width: 3rem;
        height: 3rem;
    }

.manage-groups_modal .modal-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
}

    .manage-groups_modal .modal-footer button {
        border: none;
        padding: 5px 15px;
        margin: .3rem;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.4s;
    }

        .manage-groups_modal .modal-footer .cancelate-button:hover {
            background: var(--gray-low);
        }

.responsive-group, .responsive-group-modal-body, .responsive-edit-my-groups {
    width: 100%;
}

.responsive-edit-my-groups, .responsive-edit-other-groups {
    position: absolute;
    top: 50px;
    width: 95%;
    height: 100%;
    max-height: calc(100% - 60px);
    overflow-y: scroll;
}

.responsive-group {
    border-radius: 10px;
    cursor: pointer;
    margin: .4rem 0;
    border: 1px solid var(--gray-high-2);
}

.responsive-group .group > span > h6 {
    font-size: .9rem;
    color: var(--red);
    margin: 0;
}

.group {
    font-size: 1.1rem;
    padding: .5rem 1rem;
    display: flex;
    align-items: center;
    position: relative;
}

.responsive-group-body {
    display: none;
}

.responsive-group .remove-user {
    color: var(--red);
    position: absolute;
    right: 1rem;
    cursor: pointer;
}

</style>